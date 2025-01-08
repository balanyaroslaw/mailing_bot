

export class UtilitesBot{
    public static keyboard = <T>(rows:number, array:T[]) => {
        const resultArray: Array<Array<{ text: T }>> = [];
        for(let i = 0; i < array.length; i+=rows){
            resultArray.push(array.slice(i, i + rows).map(e => ({ text: e })));
        }

        const resultKeyboard = {
          reply_markup: {
            keyboard: resultArray,
            resize_keyboard: true,
            one_time_keyboard: true, 
            remove_keyboard: true,
          },
        }

        return resultKeyboard;
  }

  public static getId = (data:string):number =>{
    return +data.split('.')[0];
  }
}
