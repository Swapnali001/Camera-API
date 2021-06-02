let constraints = {video:true, audio:true};
let videoPlayer = document.querySelector('video');
let vidRecordBtn = document.querySelector('#record-video');
let captureBtn = document.querySelector('#click-picture');
let mediaRecorder;
let recordState = false;
let chunks = [];/*chunks is an array in which we are storing the data packets sent by the browser*/
vidRecordBtn.addEventListener("click",function(){
    if(mediaRecorder!=undefined)
    //may be the promise is not resolved, therefore it may show undefined
    {
        let innerDiv = vidRecordBtn.querySelector('#record-div');
    if(recordState==false)
    {
        recordState=true;
        //mediaRecorder has predefined functions start and stop
        innerDiv.classList.add('recording-animation');
        //before capturing the video and while capturing the animation must start
        mediaRecorder.start();
        vidRecordBtn.innerText = 'Recording...'
       
    }
    else{
        recordState=false;
        innerDiv.classList.remove('recording-animation');
        mediaRecorder.stop();
        vidRecordBtn.innerText = 'Record';
    }
}
})
//navigator is a browser property like, document window
//media devices gets the access of the hardware like camera etc
//getUserMedia gets the permision from user, if the permission is 
//acceseed, the promise is resolved, then is called if not catch is called
//means access is denied
navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream){
    //src is a property in video, srcObj is an object which fetches data for it
    //media stream consists of various media tracks it internally sorts and sends audio or video files respectively
    videoPlayer.srcObject=mediaStream;
  mediaRecorder = new MediaRecorder(mediaStream);
  mediaRecorder.ondataavailable = function(e){
      chunks.push(e.data)
  }
  mediaRecorder.onstop=function()
  {
      let blob = new Blob(chunks,{type:'video/mp4'});
      chunks =[];
      let blobUrl = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = blobUrl;
      link.download='video.mp4';
      link.click();
      link.remove();
  }


}).catch(function(err){
    console.log(err);
})
captureBtn.addEventListener('click',function(){
    let innerDiv=captureBtn.querySelector('#click-div');
    innerDiv.classList.add('capture-animation');
    console.log(('clicked'));
    
    capture();
    innerDiv.classList.remove('capture-animation');
})
function capture(){
    let c= document.createElement('canvas');
    c.width = videoPlayer.videoWidth;
    c.height = videoPlayer.videoHeight;
    let tool = c.getContext('2d');
    tool.drawImage(videoPlayer,0,0);
    let link = document.createElement('a');
    link.download='image.png';
    link.href=c.toDataURL();
    link.click();
    link.remove();
    c.remove();
}