export const colors = {
    ...templateColors,
    ...{
    //app specific colors
        dark:{
            ...templateColors.dark,
            ...commonScheme,
            ...{
        //specific colors in dark mode

            }
        },
        light:{
            ...templateColors.light,
            ...commonScheme,
            ...{
                //specific colors in light mode
            }
        }
    }
}
