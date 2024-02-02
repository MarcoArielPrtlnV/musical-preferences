const d = document;


const table = d.querySelector('.users-table');
const form = d.querySelector('.preferences-form');
const template = d.getElementById('template').content;
const fragment = d.createDocumentFragment();


const ajax = (options)=>{

    let{url, method, success, error, data} = options;

    const xhr = new XMLHttpRequest();
    
    
    xhr.addEventListener('readystatechange', e=>{

    if(xhr.readyState != 4) return;

    if(xhr.status >=200 && xhr.status <300) {

        let json = JSON.parse(xhr.responseText);
        success(json);

    } else {

        let message = xhr.statusText || 'Ocurrió un error';
        error(`Error ${xhr.status}: ${message}`);
    }


});

xhr.open(method||'GET', url);

xhr.setRequestHeader('Content-type'/* Atributo */, 'application/json; charset=utf-8'/* Valor */);

xhr.send(JSON.stringify(data));

}

/* GET */
const getAllUsers = () => {

    ajax({

        url: 'http://localhost:5555/musical_preferences',
        method: 'GET',
        success: (res) => {

            console.log(res);
            res.forEach(el => {

                template.querySelector('.user-name').textContent = el.user_name;
                template.querySelector('.artist-band-name').textContent = el.artist_or_band_name;
                template.querySelector('.song').textContent = el.song_name;

                //Data Attributes//
                template.querySelector('.edit').dataset.id = el.id;
                template.querySelector('.edit').dataset.userName = el.user_name;
                template.querySelector('.edit').dataset.artist = el.artist_or_band_name;
                template.querySelector('.edit').dataset.song = el.song_name;
                template.querySelector('.delete').dataset.id = el.id;
                template.querySelector('.delete').dataset.userName = el.user_name;

                let clone = d.importNode(template, true);

                fragment.appendChild(clone);
            });

            table.querySelector('tbody').appendChild(fragment);
        },

        error: (err) => {

            console.warn(err);
            table.insertAdjacentHTML('afterend', `<p><b>${err}</b></p>`);
        },

        data: null
    });
}

d.addEventListener('DOMContentLoaded', getAllUsers);


/* POST, PUT & DELETE */

d.addEventListener('submit', e=>{

    if(e.target === form) { //POST//

        e.preventDefault(); 

        if(!e.target.id.value) {

            ajax({

                url: 'http://localhost:5555/musical_preferences',

                method: 'POST',

                success: (res) =>{

                    location.reaload();
                },

                error: (err) =>{

                    form.insertAdjacentElement('afterend', `<p><b>${err}</b></p>`);
                },

                data: {

                    user_name: e.target.yourname.value,
                    artist_or_band_name: e.target.artist.value,
                    song_name: e.target.song.value
                }
            });

        } else {

            //PUT//
            ajax({

                url: `http://localhost:5555/musical_preferences/${e.target.id.value}`,
                method: 'PUT',
                success: (res) =>{

                    location(reload);
                },
                error: (err)=>{

                    form.insertAdjacentHTML('afterend', `<p><b>${err}</b></p>`);
                },

                data: {

                    user_name:  e.target.yourname.value,
                    artist_or_band_name: e.target.artist.value, 
                    song_name: e.target.song.value 
                }
            });
        }


    }
});


//EVENTO CLICK.//

d.addEventListener('click', e=>{

    if(e.target.matches('.edit')) {

        //title.textContent = 'Edit or change your preference';

        form.yourname.value = e.target.dataset.userName;
        form.artist.value = e.target.dataset.artist;
        form.song.value = e.target.dataset.song;
        form.id.value = e.target.dataset.id;

    }

    if(e.target.matches('.delete')) { //PETICIÓN DELETE: Del objeto que origina el evento, buscar el elemento que tenga la clase '.delete'.//

        //Para hacer una petición 'DELETE' no es necesario hacer uso del $form.//  
    
        let deleteUser = confirm(`Are you sure about removing the team '${e.target.dataset.userName}' from the register?`); 
    
        if(deleteUser = true) {
    
            ajax({ 
    
                url: `http://localhost:5555/musical_preferences/${e.target.dataset.id}`, 
                method: 'DELETE',
    
                success: (res) =>{ 
    
                    
                    location.reload();
                
                },
    
                error: (err)=>{
                    
                    alert(err); 
    
                },
    
                //data: null 
    
            });
        }
       
        }
 
});



