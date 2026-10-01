import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    push,
    update
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


/* =========================
   FIREBASE
========================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyAaRBoiwFLQaQVWpy1NEST9jg0dK33YfFk",

    authDomain:
        "samia-s-closet-ee744.firebaseapp.com",

    databaseURL:
        "https://samia-s-closet-ee744-default-rtdb.firebaseio.com",

    projectId:
        "samia-s-closet-ee744",

    storageBucket:
        "samia-s-closet-ee744.firebasestorage.app",

    messagingSenderId:
        "752228653340",

    appId:
        "1:752228653340:web:e858ba5e49ceec708402d9"
};


const app =
    initializeApp(firebaseConfig);


const db =
    getDatabase(app);



/* =========================
   PAYMENT NUMBERS
========================= */


/*
   তোমার bKash number
*/

const BKASH_NUMBER =
    "8801314652599";


/*
   এখানে তোমার Nagad number বসাবে।

   Example:

   013XXXXXXXX

   অথবা:

   88013XXXXXXXX
*/

const NAGAD_NUMBER =
    "01XXXXXXXXX";



document.getElementById(
    "bkashNumberDisplay"
).textContent =
    BKASH_NUMBER;


document.getElementById(
    "nagadNumberDisplay"
).textContent =
    NAGAD_NUMBER;



/* =========================
   WHATSAPP
========================= */

const WHATSAPP_NUMBER =
    "8801314652599";


const whatsappBtn =
    document.getElementById(
        "whatsappBtn"
    );


whatsappBtn.href =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Assalamu Alaikum, I need support from Samia's Closet."
    )}`;



/* =========================
   PRODUCTS
========================= */

let products = {};


const productsRef =
    ref(db, "products");


onValue(
    productsRef,
    snapshot => {

        products =
            snapshot.val() || {};

        renderProducts();

    },
    error => {

        console.error(
            "Products error:",
            error
        );

    }
);



function renderProducts() {

    const grid =
        document.getElementById(
            "productsGrid"
        );


    const empty =
        document.getElementById(
            "emptyProducts"
        );


    const count =
        document.getElementById(
            "productCount"
        );


    grid.innerHTML = "";


    const list =
        Object.entries(products);


    count.textContent =
        `${list.length} Product${
            list.length !== 1
                ? "s"
                : ""
        }`;


    if (list.length === 0) {

        empty.style.display =
            "block";

        return;

    }


    empty.style.display =
        "none";



    list.forEach(
        ([id, product]) => {


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "product-card";



            const image =
                document.createElement(
                    "div"
                );


            image.className =
                "product-image";



            const imageUrl =
                product.imageUrl ||
                product.image;



            if (imageUrl) {

                const img =
                    document.createElement(
                        "img"
                    );


                img.src =
                    imageUrl;


                img.alt =
                    product.name ||
                    "Product";


                img.onerror =
                    () => {

                        img.style.display =
                            "none";

                        image.innerHTML =
                            "📦";

                        image.classList.add(
                            "no-image"
                        );

                    };


                image.appendChild(
                    img
                );

            } else {

                image.innerHTML =
                    "📦";

                image.classList.add(
                    "no-image"
                );

            }



            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "product-info";



            const name =
                document.createElement(
                    "div"
                );


            name.className =
                "product-name";


            name.textContent =
                product.name ||
                "Unnamed Product";



            const price =
                document.createElement(
                    "div"
                );


            price.className =
                "product-price";


            price.textContent =
                "৳" +
                Number(
                    product.price || 0
                ).toLocaleString();



            const stock =
                document.createElement(
                    "div"
                );


            stock.className =
                "product-stock";



            const stockNumber =
                Number(
                    product.stock || 0
                );



            if (stockNumber <= 0) {

                stock.textContent =
                    "Out of Stock";

                stock.classList.add(
                    "out"
                );

            } else {

                stock.textContent =
                    `${stockNumber} available`;

            }



            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "order-btn";


            button.textContent =
                stockNumber > 0
                    ? "Order Now"
                    : "Out of Stock";


            button.disabled =
                stockNumber <= 0;



            if (stockNumber > 0) {

                button.onclick =
                    () => {

                        openOrderModal(
                            id,
                            product
                        );

                    };

            }



            info.appendChild(name);

            info.appendChild(price);

            info.appendChild(stock);

            info.appendChild(button);


            card.appendChild(image);

            card.appendChild(info);


            grid.appendChild(card);

        }
    );

}



/* =========================
   ORDER MODAL
========================= */

function openOrderModal(
    id,
    product
) {

    document.getElementById(
        "orderProductId"
    ).value =
        id;


    document.getElementById(
        "orderProductName"
    ).textContent =
        product.name;


    document.getElementById(
        "orderProductPrice"
    ).textContent =
        "৳" +
        Number(
            product.price || 0
        ).toLocaleString();


    document.getElementById(
        "orderModal"
    ).classList.add(
        "active"
    );


    document.getElementById(
        "overlay"
    ).classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}



window.closeOrderModal =
    function () {

        document.getElementById(
            "orderModal"
        ).classList.remove(
            "active"
        );


        document.getElementById(
            "overlay"
        ).classList.remove(
            "active"
        );


        document.body.style.overflow =
            "";


        document.getElementById(
            "orderForm"
        ).reset();


        hidePaymentBoxes();

    };



/* =========================
   PAYMENT UI
========================= */

const paymentRadios =
    document.querySelectorAll(
        'input[name="payment"]'
    );


paymentRadios.forEach(
    radio => {

        radio.addEventListener(
            "change",
            updatePaymentUI
        );

    }
);



function updatePaymentUI() {

    const selected =
        document.querySelector(
            'input[name="payment"]:checked'
        )?.value;


    const bkashBox =
        document.getElementById(
            "bkashPaymentBox"
        );


    const nagadBox =
        document.getElementById(
            "nagadPaymentBox"
        );


    bkashBox.classList.remove(
        "active"
    );


    nagadBox.classList.remove(
        "active"
    );


    if (selected === "bKash") {

        bkashBox.classList.add(
            "active"
        );

    }


    if (selected === "Nagad") {

        nagadBox.classList.add(
            "active"
        );

    }

}



function hidePaymentBoxes() {

    document.getElementById(
        "bkashPaymentBox"
    ).classList.remove(
        "active"
    );


    document.getElementById(
        "nagadPaymentBox"
    ).classList.remove(
        "active"
    );



    document.getElementById(
        "bkashTrxId"
    ).value =
        "";


    document.getElementById(
        "nagadTrxId"
    ).value =
        "";

}



/* =========================
   PLACE ORDER
========================= */

document.getElementById(
    "orderForm"
).addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const productId =
            document.getElementById(
                "orderProductId"
            ).value;


        const product =
            products[productId];


        if (!product) {

            alert(
                "Product not found."
            );

            return;

        }



        const stock =
            Number(
                product.stock || 0
            );


        if (stock <= 0) {

            alert(
                "This product is out of stock."
            );

            closeOrderModal();

            return;

        }



        const name =
            document.getElementById(
                "customerName"
            ).value.trim();


        const phone =
            document.getElementById(
                "customerPhone"
            ).value.trim();


        const address =
            document.getElementById(
                "customerAddress"
            ).value.trim();



        const payment =
            document.querySelector(
                'input[name="payment"]:checked'
            )?.value;



        const bkashTrxId =
            document.getElementById(
                "bkashTrxId"
            ).value.trim();


        const nagadTrxId =
            document.getElementById(
                "nagadTrxId"
            ).value.trim();



        if (
            !name ||
            !phone ||
            !address
        ) {

            alert(
                "Please fill all information."
            );

            return;

        }



        /* bKash */

        if (
            payment === "bKash" &&
            !bkashTrxId
        ) {

            alert(
                "Please enter your bKash Transaction ID."
            );

            document.getElementById(
                "bkashTrxId"
            ).focus();

            return;

        }



        /* Nagad */

        if (
            payment === "Nagad" &&
            !nagadTrxId
        ) {

            alert(
                "Please enter your Nagad Transaction ID."
            );

            document.getElementById(
                "nagadTrxId"
            ).focus();

            return;

        }



        const ordersRef =
            ref(
                db,
                "orders"
            );


        const newOrder =
            push(
                ordersRef
            );



        const trxId =
            payment === "bKash"
                ? bkashTrxId
                : payment === "Nagad"
                    ? nagadTrxId
                    : "";



        const paymentNumber =
            payment === "bKash"
                ? BKASH_NUMBER
                : payment === "Nagad"
                    ? NAGAD_NUMBER
                    : "";



        const orderData = {

            id:
                newOrder.key,

            productId:
                productId,

            productName:
                product.name,

            price:
                Number(
                    product.price || 0
                ),

            customerName:
                name,

            phone:
                phone,

            address:
                address,

            paymentMethod:
                payment,

            paymentNumber:
                paymentNumber,

            trxId:
                trxId,

            status:
                "Pending",

            createdAt:
                Date.now()

        };



        try {

            await update(
                newOrder,
                orderData
            );


            closeOrderModal();


            document.getElementById(
                "successBox"
            ).classList.add(
                "active"
            );


            document.getElementById(
                "overlay"
            ).classList.add(
                "active"
            );


            document.body.style.overflow =
                "hidden";


        } catch (error) {

            console.error(
                "Order Error:",
                error
            );


            alert(
                "Order failed. Please try again."
            );

        }

    }
);



/* =========================
   SUCCESS
========================= */

window.closeSuccess =
    function () {

        document.getElementById(
            "successBox"
        ).classList.remove(
            "active"
        );


        document.getElementById(
            "overlay"
        ).classList.remove(
            "active"
        );


        document.body.style.overflow =
            "";

    };



/* =========================
   OVERLAY
========================= */

document.getElementById(
    "overlay"
).addEventListener(
    "click",
    () => {

        if (
            document.getElementById(
                "orderModal"
            ).classList.contains(
                "active"
            )
        ) {

            closeOrderModal();

        } else {

            closeSuccess();

        }

    }
);