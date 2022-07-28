


$(document).on('change', '.file-input', function() {
  document.getElementById('file_initial_message').innerHTML=''
  var filesCount = $(this)[0].files.length;    
  var textbox = $(this).prev();
  // console.log(textbox)

  if (filesCount === 1) {
    var fileName = $(this).val().split('\\').pop();
    document.getElementById('file_upload_message').innerHTML=fileName
  } else {
    document.getElementById('file_upload_message').innerHTML=filesCount +' files selected'
  }
});

window.onload= function (){
  document.getElementById('home_message').style.display='block';
  document.getElementById('rightside').style.display='none';
  document.getElementById('final_button').disabled=true;
}



function getfilemodal(val){
  console.log(val)
  document.body.style.background = 'slategray';
  var divs = document.getElementsByClassName('dropdown-btn');

    for(var i=0; i< divs.length; i++){
        divs[i].style.color = 'navajowhite';
    }
  var formats = document.getElementById(val).value.split(',');
  var format = formats.join(" , ");
  console.log(format)
  // for
  document.getElementById(val).style.color = "#043c04";
  document.getElementById('format_message').innerHTML='We Currently Support - '+format;
  document.getElementById('format_category').innerHTML=val;
  document.getElementById('home_message').style.display='none';
  document.getElementById('rightside').style.display='block';
}
// Get the modal
var modal = document.getElementById("myModal");
// When the user clicks anywhere outside of the modal, close it
window.onclick = function closemodal(event){
  modal.style.display = "none";  
} 

function countfile(event){
  document.getElementById('final_button').disabled=true;
  console.log('i m in count')
  document.getElementById('percentage').innerHTML='';
  // document.getElementById('status').innerHTML='Processing';
  var type = document.getElementById('format_category').innerHTML;
  var check = document.getElementById(type).value.split(',');
  // console.log(check)
  var Data = document.getElementById('files').files;
  // console.log(Data)\\
  var initial_c = 0
  let formData = new FormData();
  
  for (var i=0; i<Data.length;i++){  
    formData.append('file', Data[0]);   
    var filename= String(Data[i].name)
    var extension_array=filename.split('.')
    var extension = extension_array[extension_array.length-1]
    console.log('check',check)
    console.log('extension',extension)
    if (type!='Multiple'){
      if (check.includes(extension)){
        console.log('ok')
        initial_c+=1
      }
    }else {
      initial_c+=1
    }
  }
  
  if (initial_c==Data.length){
    console.log('sab thik hai ')
    function getdata(){
      return $.ajax({            
          url: 'http://127.0.0.1:8000/merge/merge/',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          global: false,          
        })
      }
    getdata()
    function getdata2(){
      return $.ajax({
        url: 'http://127.0.0.1:8000/merge/getmerge/',
        type: 'GET',
        global: false,
        success:function(data){
          console.log(data) 
            r = parseInt(data.split(',')[0]) 
            if (r<100){
                console.log(r)
                $("#progress_bar").css('width', String(r)+'%'); 
                $("#percentage").html(String(r));
                $("#status").html(data.split(',')[1]); 
                $(':button').prop('disabled', true);              
                getdata2()
            }
            if (r==100){
                $("#progress_bar").css('width', String(r)+'%');
                $("#percentage").html(String(r));
                $("#status").html(data.split(',')[1]);   
                document.getElementById('final_button').disabled=false;
                $(':button').prop('disabled', false);   
            }
            // console.log(data)         
        }                 
      })
    }
    getdata2()

     
  }else {
    
    modal.style.display = "block"
    document.getElementById('format_error_message').innerHTML='Please use correct '+type+' format'
    console.log('thik nahi h')
  }
}




