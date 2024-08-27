const updateStatus=document.getElementsByClassName('statusUpdate');
if(updateStatus){
    for(let i=0;i<updateStatus.length;i++){
        updateStatus[i].addEventListener('change',async()=>{
        const status=updateStatus[i].value.split('-')[0];
        const id=updateStatus[i].value.split('-')[1];
        const data=await fetch('/admin/compnies/updateStatus',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status, id })
        })
        if(data.ok){
            alert('status updated sucessfully');
            location.reload();
        }
        else{
            alert('status not updated sucessfully');
            location.reload();
        }
        
    })
    }
         
    //})
}