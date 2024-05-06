const mongoose=require('mongoose')

mongoose.connect(process.env.BASE_URL).then(()=>{
    console.log("______mongo db connected successfully_______");
}).catch((err)=>{
    console.log(`______mongodb not coonected,Reason:${err}______`);
})