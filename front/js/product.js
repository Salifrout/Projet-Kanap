//créer un nom de variable pour récupérer l'URL de la page
let URLofpage = location;
let url = new URL(URLofpage);

//créer une variable pour définir la valeur du paramètre id situé dans l'URL
let product_ID = url.searchParams.get("id");

const OnerequestState = fetch("http://localhost:3000/api/products/" + product_ID);

//parse in pour vérifier que ce soit un entier,  /product_id et réupère un seul objet produitt

//envisager qu'il n'y ai pas de ID dans l'URL de la page et écrire une phrase pour dire à l'utilisateur qu'il faut remplir son panier

//requêter l'API et faire apparaitre le produit sélectionné depuis la page d'accueil
OnerequestState
    .then(function(res) {
        console.info(res);
        return res.json();
    })
    .then(function(value) {
        if (!product_ID) {
            
            alert("Une erreur est survenue. Vous allez être redirigé vers la page d'accueil dans quelques instants.");
            document.body.remove();
            setTimeout(document.location.href = "https://salifrout.github.io/Projet-Kanap/front/html/index.html", 1000);
            
        } else if (product_ID !== undefined) {
        
            let product_img = document.createElement("img");
            document.querySelector("section.item article div.item__img").appendChild(product_img);
            product_img.setAttribute("alt", value.altTxt + ", " + value.name);
            product_img.setAttribute("src", value.imageUrl);

            document.getElementById("title").innerHTML = value.name;
            document.getElementById("price").innerHTML = value.price / 100;
            document.getElementById("description").innerHTML = value.description;

            document.getElementById("colors").options.length = 0;

            let colorsofproduct = value.colors;
            for (let color of colorsofproduct) {
                let colorInOption = document.createElement("option");
                document.getElementById("colors").appendChild(colorInOption);
                colorInOption.setAttribute("option", color);
                colorInOption.innerHTML = color;
            }  
        }
    })
    .catch(function(err) {
        //prévenir en cas d'erreur
        console.log(err);
    })
;


//créer une classe pour mettre des informations sur chaque produit
class Product {
    constructor(id, number, coloration, image, alternative, name, price) {
        this.id = id;
        this.number = number;
        this.coloration = coloration;
        this.image = image;
        this.alternative = alternative;
        this.name = name;
        this.price = price;
    }
}

async function CreateProductForCart() {
    const request = await fetch("http://localhost:3000/api/products/" + product_ID);
    const result = await request.json();
    const valueForimage = await result.imageUrl;
    const valueForalternative = await result.altTxt;
    const valueForname = await result.name;
    const valueForprice = await result.price;
    const valueForID = await result._id;

    if (document.getElementById("quantity").value == 0 || document.getElementById("quantity").value > 100) {
        alert("La quantité choisie pour votre produit n'est pas possible. Veuillez choisir une quantité différente.");
        return false;
    } else {
    let quantite = document.getElementById("quantity").value;
    let couleur = document.getElementById("colors").value;

    let OneProduct = new Product(valueForID, quantite, couleur, valueForimage, valueForalternative, valueForname, valueForprice);   
        
    return OneProduct;
    }    
}

//fonction pour augmenter quantité d'un produit choisi
async function UpdateCart() {

    let OneProduct = await CreateProductForCart();

    //if (Cart.length === 0) {
    if (!JSON.parse(localStorage.getItem('Allproducts'))) {
        let Cart = [];
        Cart.push(OneProduct);
        console.log("Le panier est vide, un nouveau produit est ajouté.");
        return Cart;
    } else {
        let Cart = JSON.parse(localStorage.getItem("Allproducts"));
        for (let CartParts of Cart) {
            if (OneProduct === CartParts) {
                OneProduct.number += CartParts.number;
                console.log("On augmente la quantité pour un produit.");
                return Cart;
            } else { 
                Cart.push(OneProduct);
                console.log("Un produit est ajouté au panier.");  
                return Cart;
            }
        }
    }
}
    
//vider le local puis remettre le tableau mis à jour
async function UpdateStorage() {

    let Cart = await UpdateCart();

    localStorage.removeItem('Allproducts');
    localStorage.setItem('Allproducts', JSON.stringify(Cart));
    console.log("Le Storage s'est mis à jour.");
}

//créer une fonction unique qui permettra d'exécuter toutes les fonctions précédentes à la fois
async function AddNewProductInStorage() {
    if (product_ID !== undefined) {
        await CreateProductForCart();
        
        if (CreateProductForCart()) {
           // await UpdateCart();
            await UpdateStorage();
            console.log(Storage.length);
            console.log(localStorage.getItem('Allproducts'));
            return true;
        } else {
            return false;
        }
    } else {
        console.error("le produit n'a pas pu être rajouté au panier");
    }
}

//exécuter la dernière fonction lors du clique de l'utilisateur sur le bouton
document.getElementById("addToCart").addEventListener('click', AddNewProductInStorage);




/*que les memes produits augmentent la quantité au lieu de se rajouter
que le prix du produit change lors de la quantité
que le bouton supprimer soit effectif
mettre le total de tous les produits*/