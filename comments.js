function comment(data){

    var msgCom = '';
     if(!data.length){
       msgCom = 'Be the first to post a comment ! :)';
     }
    //  console.log(msgCom);
    return msgCom;
};

module.exports = {
  msgCom: comment
}
