import {
    initializeApp
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {
    getDatabase,
    ref,
    push,
    set,
    onValue,
    remove,
    update,
    runTransaction
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



/* =========================
   FIREBASE CONFIG
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
    initializeApp(
        firebaseConfig
    );


const db =
    getDatabase(app);


const auth =
    getAuth(app);



/* =========================
   HTML ELEMENTS
========================= */

const loginScreen =
    document.getElementById(
        "loginScreen"
    );


const adminApp =
    document.getElementById(
        "adminApp"
    );


const loginForm =
    document.getElementById(
        "loginForm"
    );


const loginEmail =
    document.getElementById(
        "loginEmail"
    );


const loginPassword =
    document.getElementById(
        "loginPassword"
    );


const loginError =
    document.getElementById(
        "loginError"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


const productForm =
    document.getElementById(
        "productForm"
    );


const productName =
    document.getElementById(
        "productName"
    );


const productPrice =
    document.getElementById(
        "productPrice"
    );


const productStock =
    document.getElementById(
        "productStock"
    );


const productImage =
    document.getElementById(
        "productImage"
    );


const productMessage =
    document.getElementById(
        "productMessage"
    );


const adminProducts =
    document.getElementById(
        "adminProducts"
    );


const adminOrders =
    document.getElementById(
        "adminOrders"
    );


const productCount =
    document.getElementById(
        "productCount"
    );


const orderCount =
    document.getElementById(
        "orderCount"
    );



/* =========================
   AUTH STATE
========================= */

onAuthStateChanged(
    auth,
    user => {

        if (user) {

            console.log(
                "Admin logged in:",
                user.uid
            );


            loginScreen.classList.add(
                "hidden"
            );


            adminApp.classList.remove(
                "hidden"
            );


            loadProducts();

            loadOrders();


        } else {

            loginScreen.classList.remove(
                "hidden"
            );


            adminApp.classList.add(
                "hidden"
            );

        }

    }
);



/* =========================
   LOGIN
========================= */

loginForm.addEventListener(
    "submit",
    async e => {

        e.preventDefault();


        loginError.textContent =
            "";


        const email =
            loginEmail.value.trim();


        const password =
            loginPassword.value;


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );


            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                loginError.textContent =
                    "Email or password is incorrect.";

            } else if (
                error.code ===
                "auth/user-not-found"
            ) {

                loginError.textContent =
                    "This email is not registered.";

            } else if (
                error.code ===
                "auth/wrong-password"
            ) {

                loginError.textContent =
                    "Wrong password.";

            } else if (
                error.code ===
                "auth/invalid-email"
            ) {

                loginError.textContent =
                    "Please enter a valid email.";

            } else {

                loginError.textContent =
                    error.message;

            }

        }

    }
);



/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener(
    "click",
    async () => {

        try {

            await signOut(
                auth
            );

        } catch (error) {

            console.error(
                error
            );

        }

    }
);



/* =========================
   ADD PRODUCT
========================= */

productForm.addEventListener(
    "submit",
    async e => {

        e.preventDefault();


        productMessage.textContent =
            "";


        const name =
            productName.value.trim();


        const price =
            Number(
                productPrice.value
            );


        const stock =
            Number(
                productStock.value
            );


        const image =
            productImage.value.trim();



        if (
            !name ||
            !image
        ) {

            productMessage.textContent =
                "Please fill all fields.";

            return;

        }



        try {

            const productRef =
                push(
                    ref(
                        db,
                        "products"
                    )
                );


            await set(
                productRef,
                {

                    name:
                        name,

                    price:
                        price,

                    stock:
                        stock,

                    image:
                        image,

                    createdAt:
                        Date.now()

                }
            );


            productForm.reset();


            productMessage.textContent =
                "Product added successfully!";


        } catch (error) {

            console.error(
                "Product Error:",
                error
            );


            productMessage.textContent =
                "Could not add product.";

        }

    }
);



/* =========================
   LOAD PRODUCTS
========================= */

function loadProducts() {

    const productsRef =
        ref(
            db,
            "products"
        );


    onValue(
        productsRef,
        snapshot => {

            adminProducts.innerHTML =
                "";


            const data =
                snapshot.val();


            if (!data) {

                productCount.textContent =
                    "0 Products";


                adminProducts.innerHTML =
                    `
                    <p class="empty">
                        No products yet.
                    </p>
                    `;

                return;

            }



            const products =
                Object.entries(
                    data
                );


            productCount.textContent =
                `${products.length} Product${
                    products.length !== 1
                        ? "s"
                        : ""
                }`;



            products.forEach(
                ([id, product]) => {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "product-admin-card";



                    const imageUrl =
                        product.imageUrl ||
                        product.image ||
                        "";



                    card.innerHTML =
                        `

                        <img
                            src="${escapeHtml(imageUrl)}"
                            alt="${escapeHtml(
                                product.name ||
                                "Product"
                            )}"
                            onerror="
                                this.style.display='none'
                            "
                        >

                        <div class="product-admin-info">

                            <h3>
                                ${escapeHtml(
                                    product.name ||
                                    "Unnamed Product"
                                )}
                            </h3>

                            <p class="product-price">
                                ৳${Number(
                                    product.price || 0
                                ).toLocaleString()}
                            </p>

                            <p class="stock">
                                Stock:
                                ${Number(
                                    product.stock || 0
                                )}
                            </p>

                            <button
                                class="delete-btn"
                            >
                                Delete
                            </button>

                        </div>

                        `;



                    const deleteBtn =
                        card.querySelector(
                            ".delete-btn"
                        );


                    deleteBtn.addEventListener(
                        "click",
                        () =>
                            deleteProduct(
                                id
                            )
                    );


                    adminProducts.appendChild(
                        card
                    );

                }
            );

        }
    );

}



/* =========================
   DELETE PRODUCT
========================= */

async function deleteProduct(
    id
) {

    const confirmed =
        confirm(
            "Delete this product?"
        );


    if (!confirmed)
        return;


    try {

        await remove(
            ref(
                db,
                `products/${id}`
            )
        );


    } catch (error) {

        console.error(
            error
        );


        alert(
            "Could not delete product."
        );

    }

}



/* =========================
   LOAD ORDERS
========================= */

function loadOrders() {

    const ordersRef =
        ref(
            db,
            "orders"
        );


    onValue(
        ordersRef,
        snapshot => {

            adminOrders.innerHTML =
                "";


            const data =
                snapshot.val();


            if (!data) {

                orderCount.textContent =
                    "0 Orders";


                adminOrders.innerHTML =
                    `
                    <p class="empty">
                        No orders yet.
                    </p>
                    `;

                return;

            }



            const orders =
                Object.entries(
                    data
                );


            orderCount.textContent =
                `${orders.length} Order${
                    orders.length !== 1
                        ? "s"
                        : ""
                }`;



            orders.reverse();



            orders.forEach(
                ([id, order]) => {

                    renderOrder(
                        id,
                        order
                    );

                }
            );

        }
    );

}



/* =========================
   RENDER ORDER
========================= */

function renderOrder(
    id,
    order
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "order-card";



    const status =
        order.status ||
        "Pending";


    const payment =
        order.paymentMethod ||
        order.payment ||
        "COD";


    const trxId =
        order.trxId ||
        "";


    const paymentNumber =
        order.paymentNumber ||
        order.bkashNumber ||
        "";



    const paymentDetails =
        payment === "COD"

            ? `
                <p>
                    <strong>
                        Payment:
                    </strong>

                    Cash on Delivery
                </p>
            `

            : `

                <p>
                    <strong>
                        Payment:
                    </strong>

                    ${escapeHtml(payment)}
                </p>

                <p>
                    <strong>
                        Payment Number:
                    </strong>

                    ${escapeHtml(
                        paymentNumber
                    )}
                </p>

                <p>
                    <strong>
                        Transaction ID:
                    </strong>

                    <span class="trx-display">
                        ${escapeHtml(
                            trxId ||
                            "Not provided"
                        )}
                    </span>
                </p>

            `;



    const dateText =
        order.createdAt
            ? new Date(
                order.createdAt
            ).toLocaleString()
            : "";



    card.innerHTML =
        `

        <h3>
            ${escapeHtml(
                order.productName ||
                "Product"
            )}
        </h3>


        <p>
            <strong>
                Customer:
            </strong>

            ${escapeHtml(
                order.customerName ||
                ""
            )}
        </p>


        <p>
            <strong>
                Phone:
            </strong>

            ${escapeHtml(
                order.phone ||
                ""
            )}
        </p>


        <p>
            <strong>
                Address:
            </strong>

            ${escapeHtml(
                order.address ||
                ""
            )}
        </p>


        ${paymentDetails}


        <p>
            <strong>
                Price:
            </strong>

            ৳${Number(
                order.price || 0
            ).toLocaleString()}
        </p>


        ${
            dateText
                ? `
                    <p class="order-date">
                        ${escapeHtml(
                            dateText
                        )}
                    </p>
                `
                : ""
        }


        <span class="order-status">
            Status: ${escapeHtml(
                status
            )}
        </span>


        ${
            status === "Pending"
                ? `

                    <br>

                    <button
                        class="confirm-btn"
                    >
                        Confirm Order
                    </button>

                `
                : ""
        }

        `;



    const confirmBtn =
        card.querySelector(
            ".confirm-btn"
        );


    if (confirmBtn) {

        confirmBtn.addEventListener(
            "click",
            () =>
                confirmOrder(
                    id,
                    order
                )
        );

    }


    adminOrders.appendChild(
        card
    );

}



/* =========================
   CONFIRM ORDER
========================= */

async function confirmOrder(
    orderId,
    order
) {

    const confirmed =
        confirm(
            `Confirm this order?\n\n${order.productName || "Product"}`
        );


    if (!confirmed)
        return;



    try {

        /*
           First decrease stock safely
           using Firebase transaction.
        */

        const stockRef =
            ref(
                db,
                `products/${order.productId}/stock`
            );


        const result =
            await runTransaction(
                stockRef,
                currentStock => {

                    const current =
                        Number(
                            currentStock || 0
                        );


                    if (current <= 0) {

                        return;

                    }


                    return current - 1;

                }
            );



        if (
            !result.committed
        ) {

            alert(
                "This product is out of stock."
            );

            return;

        }



        /*
           Then confirm order.
        */

        await update(
            ref(
                db,
                `orders/${orderId}`
            ),
            {

                status:
                    "Confirmed",

                confirmedAt:
                    Date.now()

            }
        );


        alert(
            "Order confirmed successfully!"
        );


    } catch (error) {

        console.error(
            "Confirm Error:",
            error
        );


        alert(
            "Could not confirm order."
        );

    }

}



/* =========================
   SECURITY HELPER
========================= */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}