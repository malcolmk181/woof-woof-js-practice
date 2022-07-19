const URL = "http://localhost:3000"

document.addEventListener("DOMContentLoaded", () => {
    /*  =========
        CONSTANTS
        =========
    */
    const dogBar = document.querySelector("#dog-bar");
    const dogInfo = document.querySelector("#dog-info");

    // given a Dog object, add it to the dogBar
    const addDogToDogBar = dog => {
        let dogSpan = document.createElement('span');
        dogSpan.textContent = dog.name;
        dogSpan.dataset.id = dog.id;
        dogBar.appendChild(dogSpan);
    }

    // given an array of Dog objects, add them to the dogBar
    const buildDogBar = dogs => dogs.forEach(addDogToDogBar)

    // given an id of a dog, display that dog's info
    const displayDog = id => {
        fetch(`${URL}/pups/${id}`)
        .then(resp => resp.json())
        .then(dog => {
            dogInfo.dataset.id = dog.id;
            dogInfo.dataset.isGoodDog = dog.isGoodDog;
            dogInfo.innerHTML = `
                <img src=${dog.image}>
                <h2>${dog.name}</h2>
                <button>${dog.isGoodDog ? "Good Dog!" : "Bad Dog"}</button>
            `
        });
    }

    /*  ============
        INSTRUCTIONS
        ============
    */

    // populate dogBar
    fetch(`${URL}/pups`)
    .then(resp => resp.json())
    .then(buildDogBar);

    // dogBar click event listener
    dogBar.addEventListener("click", event => {
        if (event.target.nodeName === 'SPAN') {displayDog(event.target.dataset.id)}
    })

    // dogInfo click event listener
    dogInfo.addEventListener("click", event => {
        if (event.target.nodeName === 'BUTTON') {
            fetch(`${URL}/pups/${event.target.parentNode.dataset.id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ isGoodDog : !(event.target.parentNode.dataset.isGoodDog === 'true') })
            })
            .then(resp => resp.json())
            .then(data => {
                event.target.parentNode.dataset.isGoodDog = data.isGoodDog;
                event.target.innerHTML = data.isGoodDog ? "Good Dog!" : "Bad Dog";
            })
            .catch(console.log);
        }
    })

})