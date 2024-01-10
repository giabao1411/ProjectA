


function getAllData(){
    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");



var requestOptions = {
  method: 'GET',
  headers: myHeaders,
 
  redirect: 'follow'
};

 return fetch("https://fakestoreapi.com/products", requestOptions)
  .then(function(response){
    if(!response.ok){
        throw Error(response.statusText);
    }
    return response.json();
  }).then(data=> {
    // Do stuff with the JSON
    console.log(data);
    return data;
   
  }).catch(function(error) {
    console.log('Looks like there was a problem: \n', error);
  });
      
}
function getDetail(id){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      return fetch("https://fakestoreapi.com/products/"+id, requestOptions)
        .then(function(response ){
            if(!response.ok){
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data=>{
            return data;
        })
        .catch(error => console.log('error', error));
}
document.addEventListener('DOMContentLoaded', function() {
   var divContent= document.getElementById("content");

   getAllData().then(data=>{
    for(var i =0 ; i<data.length;i++){

        var newDiv=document.createElement('div');

        newDiv.setAttribute("class","product-item");
        newDiv.setAttribute("id",data[i].id);
        newDiv.setAttribute("onclick",`openPopup(${data[i].id})`);
        
        var newP= document.createElement('p');
        var newImg= document.createElement('img');
        
        newP.textContent=data[i].title;
        newImg.src=data[i].image;
       
        newDiv.appendChild(newImg);
        newDiv.append(newP);
        
        divContent.appendChild(newDiv);

    }

    let iconCart  = document.querySelector("#btnCart");

let cart  = document.querySelector('.cart');
let container  = document.querySelector('.body');
let close  = document.querySelector('.close');

iconCart.addEventListener('click',()=>{
    if(cart.style.right=='-100%'){
        cart.style.right='0';
        // container.style.transform='translateX(-400px)';

    }else{
        cart.style.right='-100%';
        // container.style.transform='translateX(0)';
    }
    updateCartDisplay();
   
})

close.addEventListener('click',()=>{
    cart.style.right='-100%';
    // container.style.transform='translateX(0)';
})
   })
   
   
});

   

function openPopup(id) {
    getDetail(id).then(data=>{
        
        
        document.getElementById("popupImage").src = data.image; // Đường dẫn thực tế đến hình ảnh sản phẩm
        document.getElementById("popupName").innerText = "Title: "+data.title;
        document.getElementById("popupType").innerText = "Category: "+ data.category;
        document.getElementById("popupPrice").innerText ="Price: "+ data.price+"$";
        document.getElementById("popupDescription").innerText="Description: "+data.description;
        document.getElementById("popup").style.display = "flex";
        document.getElementById("addToCart").setAttribute("onclick",`addItem(${data.id},"${data.title}",${data.price},"${data.image}")`);
       
    });
  
}

// Đóng popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}
function addItem(id, name, price,image) {
    // Kiểm tra xem giỏ hàng có tồn tại trong sessionStorage hay không
    closePopup();
    
    
    let cart = sessionStorage.getItem('cart');
    if (!cart) {
        cart = {};
    } else {
        cart = JSON.parse(cart);
    }

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    if (cart[id]) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng lên 1
        cart[id].quantity++;
    } else {
        // Nếu sản phẩm chưa tồn tại, thêm vào giỏ hàng với số lượng là 1
        cart[id] = {
            name: name,
            price: price,
            quantity: 1,
            image:image
        };
    }

    // Lưu giỏ hàng vào sessionStorage
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Cập nhật hiển thị giỏ hàng
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsElement = document.querySelector('.listCart');
    
  
    
    cartItemsElement.innerHTML = ''; // Xóa nội dung cũ
    var totalPrice=0;
    // Lấy giỏ hàng từ sessionStorage
    const cart = JSON.parse(sessionStorage.getItem('cart')) || {};
    
    // Hiển thị từng sản phẩm trong giỏ hàng
    for (const [id, item] of Object.entries(cart)) {
        const listItem = document.createElement('div');
        listItem.classList.add('item');
        listItem.innerHTML=` <img src="${item.image}" alt="">
        <div class="content">
      
       <div class="name">${item.name}</div>
       <div class="price">${item.price}</div>
    </div>
       <div class="quantity">
       <button onclick="changeQuantity(${id},'-')">-</button>
       <span class="value">${item.quantity}</span>
       <button onclick="changeQuantity(${id},'+')">+</button>`
        // listItem.textContent = `${item.name} - $${item.price} x ${item.quantity}`;

        // const removeButton = document.createElement('button');
        // removeButton.textContent = 'Remove';
        // removeButton.onclick = function() {
        //     removeItem(id);
        // };

        // listItem.appendChild(removeButton);
        totalPrice+=item.price*item.quantity;
        cartItemsElement.appendChild(listItem);
    }
    const divTotal=document.querySelector('.divTotal');
    var divCart = document.querySelector('.cart');
    divTotal.innerText=`Total Price: `+ totalPrice;
    
    
}

function removeItem(id) {
    // Lấy giỏ hàng từ sessionStorage
    const cart = JSON.parse(sessionStorage.getItem('cart')) || {};

    // Xóa sản phẩm khỏi giỏ hàng
    delete cart[id];

    // Lưu giỏ hàng sau khi xóa vào sessionStorage
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Cập nhật hiển thị giỏ hàng
    updateCartDisplay();
}
function changeQuantity(id,type){
    const cart = JSON.parse(sessionStorage.getItem('cart')) || {};
    console.log(cart[1]);
    switch(type){
        case '+':
            cart[id].quantity++;
            sessionStorage.setItem('cart', JSON.stringify(cart));
            break;
        case '-':
            cart[id].quantity--;
            if(cart[id].quantity <=0){
                delete cart[id];
            }
            sessionStorage.setItem('cart', JSON.stringify(cart));
            break;
        default: 
        break;    
    }
    updateCartDisplay();
}
