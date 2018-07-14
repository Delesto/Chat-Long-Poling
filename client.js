const form = document.getElementById('myForm');
const messages = document.getElementById('messages');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.textField;

    publish('http://localhost:3000/publish', input.value);
});

const createLi = (amount, text) => {
    const arrOfLi = [];
    for (let i = 0; i < amount; i++) {
        const li = document.createElement('li');
        li.textContent = text;
        arrOfLi.push(li);
    }
    return arrOfLi;
};

const appendLiToDom = (li) => {
    if (Array.isArray(li)) {
        li.forEach(element => {
            messages.appendChild(element);
        });
    }
}

const publish = (url, data) => {
    const options = {
        method: 'POST',
        cache: 'no-cache',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'text/plain; charset=utf-8'
        }
    };

    fetch(url, options)
        .catch(err => console.error(err));
};

const subscribe = (url) => {
    //GET REQUEST
    fetch(url)
        .then((data) => {
            return data.json();
        })
        .then((data) => {
            return appendLiToDom(createLi(1, data));
        })
        .then(() => {
            subscribe(url);
        })
        .catch((err) => {
            console.error(err);
            setTimeout(subscribe, 500);
        });
}
subscribe('http://localhost:3000/subscribe');