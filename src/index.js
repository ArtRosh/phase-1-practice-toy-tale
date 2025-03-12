let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.querySelector("#new-toy-btn");
    const toyFormContainer = document.querySelector(".container");
    const toyCollection = document.getElementById("toy-collection");
    const toyForm = document.querySelector(".add-toy-form");
    
    addBtn.addEventListener("click", () => {
        addToy = !addToy;
        toyFormContainer.style.display = addToy ? "block" : "none";
    });

    // Загружаем игрушки при загрузке страницы
    fetch("http://localhost:3000/toys")
        .then(response => response.json())
        .then(toys => toys.forEach(renderToy));
    
    // Форма добавления новой игрушки
    toyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const toyName = e.target.name.value;
        const toyImage = e.target.image.value;
        
        const newToy = {
            name: toyName,
            image: toyImage,
            likes: 0
        };
        
        fetch("http://localhost:3000/toys", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newToy)
        })
        .then(response => response.json())
        .then(renderToy);
    });

    function renderToy(toy) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h2>${toy.name}</h2>
            <img src="${toy.image}" class="toy-avatar" />
            <p>${toy.likes} Likes</p>
            <button class="like-btn" id="${toy.id}">Like ❤️</button>
        `;
        
        const likeBtn = card.querySelector(".like-btn");
        likeBtn.addEventListener("click", () => {
            toy.likes++;
            fetch(`http://localhost:3000/toys/${toy.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ likes: toy.likes })
            })
            .then(response => response.json())
            .then(updatedToy => {
                card.querySelector("p").innerText = `${updatedToy.likes} Likes`;
            });
        });
        
        toyCollection.appendChild(card);
    }
});
