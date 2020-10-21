function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');
let activeItem = null;

buildlist = () => {
    const wrapper = document.getElementById('list-wrapper');
    wrapper.innerHTML = '';
    const url = 'http://127.0.0.1:8000/api/task-lists/';

    fetch(url)
    .then((resp) => resp.json())
    .then((data)=>{
        const list = data; 
        for (let i in list){
            let title = `<span class="title">${list[i].title}</span>`;
            if(list[i].completed == true){
                title = `<strike class="title">${list[i].title}</strike>`
            }
            let item = `
                <div id="data-row-${i}" class="task-wrapper flex-wrapper">
                    <div style="flex:7">
                        ${title}
                    </div>
                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-info edit">Edit</button>
                    </div>
                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-dark delete">-</button>
                    </div>
                </div>
            `
            wrapper.innerHTML += item;
            
        }
        for(let i in list){
            let editButton = document.getElementsByClassName('edit')[i];
            let deleteButton = document.getElementsByClassName('delete')[i];
            let title = document.getElementsByClassName('title')[i]
            editButton.addEventListener('click', ((item)=>{
                return function(){
                    editItem(item)
                }
            })(list[i]))

            deleteButton.addEventListener('click', ((item)=>{
                return function(){
                    deleteItem(item)
                }
            })(list[i]))
            
            title.addEventListener('click', ((item)=>{
                return function(){
                    strikeUnstrike(item)
                }
            })(list[i]))
        }
    })
}

editItem = (item) => {
    activeItem = item;
    document.getElementById('title').value = activeItem.title;
}

deleteItem = (item) => {
    fetch(`http://127.0.0.1:8000/api/task-delete/${item.id}/`, {
        method:'DELETE',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
        }
    }).then((response)=>{
        buildlist();
    })
}

strikeUnstrike = (item) => {
    item.completed = !item.completed
    fetch(`http://127.0.0.1:8000/api/task-update/${item.id}/`, {
        method:'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body:JSON.stringify({'title':item.title, 'completed':item.completed})
    }).then((response)=>{
        buildlist();
    })
}

buildlist();

const form = document.getElementById('form-wrapper');
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    let url = 'http://127.0.0.1:8000/api/task-create/';
    if(activeItem != null){
       url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}/`;
       activeItem = null;
    }
    let title = document.getElementById('title').value
    fetch(url, {
        method: 'POST',
        headers:{
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body:JSON.stringify({'title':title})
    }
    ).then((response)=>{
        buildlist();
        document.getElementById('form').reset();
    })
})