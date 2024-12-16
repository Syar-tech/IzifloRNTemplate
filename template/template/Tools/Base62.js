class Base62 {
    /**
     * The base62 scheme with the 62 characters
     * @returns string
     */
    static get scheme() {
      return "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
  
    /**
     * The base62 scheme size
     * @returns number
     */
    static get length() {
      return this.scheme.length;
    }
  
    /**
     * Encode the number to the string representation using the 62 characters.
     * @param {number} number
     * @returns string
     * @throws Error
     */
    static encode(number) {
        if(typeof(number) ==='string'){
            try{
                number = Number.parseInt(number)
            }catch(e){
                // nothing to do, wait for throw below
            }
        }
      if (!Number.isInteger(number)) {
        throw new Error("The value has to be a number");
      }
  
      let result = [];
  
      while (number > 0) {
        const division = Math.floor(number / this.length);
        const remainder = Math.floor(number % this.length);
        const character = this.scheme[remainder];
        number = division;
        result = [character, ...result];
      }
      return result.join("");
    }
  
    /**
     * Decode the string to the correct number
     * @param {string} chars
     * @returns number
     * @throws Error
     */
    static decode(chars) {
      if (typeof chars != "string") {
        throw new Error("The value has to be a string");
      }
  
      const charsReverse = chars.split("").reverse();
  
      return charsReverse.reduce((ac, char, index) => {
        const number = this.scheme.indexOf(char);
        return ac + number * Math.pow(this.length, index);
      }, 0);
    }
  }

  export default Base62