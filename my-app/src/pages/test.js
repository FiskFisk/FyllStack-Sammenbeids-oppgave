// config backend

function testAPI() {
    fetch("/api/test")
        .then(response => response.json())
        .then(data => {
            console.log(data);  
        })

}

function registerUser() {
    fetch('http://localhost:5000/create_user', {
         method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);  
})}
