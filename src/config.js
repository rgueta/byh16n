module.exports = {
    app:{
        port : 5000,
        host:'',
        public_host : 'http://192.168.1.173:5000',
        images_root : 'img/uploads/',
        Resized_prefix : 'S_'
    },
    auth:{
        SECRET: 'long-life-bytheg-project',
        SECRET_REFRESH: 'long-life-bytheg-project-refresh',
        SECRET_PWD_RST: 'long-life-bytheg-project-password-rst',
        defaultRole : 'visitor',
        //24 hrs. in seconds
        token_time:86400,
        // token_time: 20
        // ------  AWS  ---------------------
        AWS_BUCKET_NAME : "byh16n.imgs",
        AWS_BUCKET_REGION : "us-west-2",
        AWS_ACCESS_KEY : "AKIATRJO2V5LJHF45G2F",
        AWS_SECRET_KEY : "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" 
    },
    db: {
        // url : "mongodb://bytheg:bytheg2021@localhost:27017/byh16"
        url : "mongodb+srv://admin:bytheg2021@cluster0.mkecl.mongodb.net/byh16"
        //mongoose_url:'mongodb://localhost:27017/byh16',
   },
   twilio :{
    SID : "AC146ef36707a2906ff3aa37e934b56b53",
    AUTH_TOKEN : "ed4e9d6422dfc026ce945563290ab654",
    MSG_SID : "MGe8f3e7143c2962fbeac086f010615494"
  }
}
