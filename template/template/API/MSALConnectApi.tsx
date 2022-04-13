import { Platform } from "react-native";
import Config from "react-native-config";
import { getBundleId } from "react-native-device-info";
import PublicClientApplication, { MSALAccount, MSALConfiguration, MSALInteractiveParams, MSALResult, MSALSilentParams } from "react-native-msal"

export type MSALSignInParams = Omit<MSALInteractiveParams, 'authority'>;
export type MSALAcquireTokenSilentParams = Pick<MSALSilentParams, 'forceRefresh' | 'scopes'>;
const sMSAL_AUTHORITY = 'IZI_MSAL_SIGNIN'
export default class MSALConnect {
    private static  config  : MSALConfiguration = {
        auth: {
          clientId: Config.MICROSOFT_CLIENT_ID,
          redirectUri: Platform.select({
           android: 'msauth://'+ getBundleId() +'/'+ encodeURIComponent(Config.SIGNATURE_HASH), // ex: "msauth://com.package/Xo8WBi6jzSxKDVR4drqm84yr9iU%3D"
           default: undefined,
         }),
          //authority: getBundleId()+"/default_msal_authority"
        },
      };

    
    private pca? : PublicClientApplication
    
    public isInit(){return this.pca != undefined}
    public async init(){
        if(!this.pca)
        {
            this.pca = new PublicClientApplication(MSALConnect.config);
            try {
                await this.pca.init();
            } catch (error) {
                console.error('Problem in configuration/setup:', error);
            }
        }
    }

    /** Initiates an interactive sign-in. If the user clicks "Forgot Password", and a reset password policy
   *  was provided to the client, it will initiate the password reset flow
   */
  public async signIn(params: MSALSignInParams): Promise<MSALResult> {

    if(!this.pca) throw Error("MSAL not init")

    const isSignedIn = await this.isSignedIn()
    if (isSignedIn) {
      throw Error('A user is already signed in');
    }
      // If we don't provide an authority, the PCA will use the one we passed to it when we created it
      // (the sign in sign up policy)
      return await this.pca.acquireToken(params);
    
  }

  /** Gets a token silently. Will only work if the user is already signed in */
  public async acquireTokenSilent(params: MSALAcquireTokenSilentParams) {
    if(!this.pca) throw Error("MSAL not init")

    const account = await this.getAccount();
    if (account) {
      // We provide the account that we got when we signed in, with the matching sign in sign up authority
      // Which again, we set as the default authority so we don't need to provide it explicitly.
      try {
        return await this.pca.acquireTokenSilent({ ...params, account });
      } catch (error) {
        /*if (error.message.includes(B2CClient.B2C_EXPIRED_GRANT)) {
          await this.pca.signOut({ ...params, account });
          return await this.signIn(params);
        } else {*/
          throw error;
       // }
      }
    } else {
      throw Error('Could not find existing account for sign in sign up policy');
    }
  }

  /** Returns true if a user is signed in, false if not */
  public async isSignedIn() {
    if(!this.pca) throw Error("MSAL not init")
    const signInAccount = await this.getAccount();
    return signInAccount !== undefined;
  }

  /** Removes all accounts from the device for this app. User will have to sign in again to get a token */
  public async signOut() {
    if(!this.pca) throw Error("MSAL not init")
    const accounts = await this.pca.getAccounts();
    const signOutPromises = accounts.map((account) => this.pca!!.signOut({account}));
    await Promise.all(signOutPromises);
    return true;
  }

  public async getAccounts(): Promise<MSALAccount[] | undefined> {
    if(!this.pca) throw Error("MSAL not init")
    return await this.pca.getAccounts();
  }

  public async getAccount(): Promise<MSALAccount | undefined> {
    if(!this.pca) throw Error("MSAL not init")
    let accounts = await this.pca.getAccounts();
    if(accounts.length >0){
      return accounts[0];
    }
    return undefined
    //return await this.pca.getAccount(MSALConnect.config.auth.authority!!);
  }

}