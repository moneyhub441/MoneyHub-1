import {
  ArrowLeft,
  Package,
  Search,
  ShoppingBag,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import "../css/AdminProducts.css";

type Product = {
  id: number;
  name: string;
  category: string;
  validity: string;
  price: number;
  image: string;
  type: "Daily" | "Welfare";
  badge?: string;
};

type FilterType =
  | "All"
  | "Daily"
  | "Welfare";

/* =========================
   PRODUCTS
========================= */

const productsData: Product[] = [
  {
    id: 1,
    name: "Special Product",
    category: "Premium",
    validity: "30 Days",
    price: 700,
    image: "/products/product-1.png",
    type: "Daily",
    badge: "POPULAR",
  },

  {
    id: 2,
    name: "Product 2",
    category: "Standard",
    validity: "30 Days",
    price: 1200,
    image: "/products/product-2.png",
    type: "Daily",
  },

  {
    id: 3,
    name: "Product 3",
    category: "Premium",
    validity: "60 Days",
    price: 2500,
    image: "/products/product-3.png",
    type: "Daily",
  },

  {
    id: 4,
    name: "Product 4",
    category: "Premium Plus",
    validity: "90 Days",
    price: 5000,
    image: "/products/product-4.png",
    type: "Daily",
  },

  {
    id: 101,
    name: "Welfare Product 1",
    category: "Welfare",
    validity: "30 Days",
    price: 500,
    image: "/products/product-1.png",
    type: "Welfare",
  },

  {
    id: 102,
    name: "Welfare Product 2",
    category: "Welfare Plus",
    validity: "60 Days",
    price: 1000,
    image: "/products/product-2.png",
    type: "Welfare",
  },
];

function AdminProducts() {
  const navigate = useNavigate();
  const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


const [purchases, setPurchases] =
  useState<any[]>([]);


const [loadingSales, setLoadingSales] =
  useState(true);

  const [filter, setFilter] =
    useState<FilterType>("All");

  const [search, setSearch] =
    useState("");

  /* =========================
     COUNTS
  ========================= */

  const dailyCount =
    productsData.filter(
      (product) =>
        product.type === "Daily"
    ).length;

  const welfareCount =
    productsData.filter(
      (product) =>
        product.type === "Welfare"
    ).length;

  
/* =========================
   LOAD PURCHASE SALES
========================= */

useEffect(()=>{

const loadPurchases =
async()=>{

try{

const response =
await fetch(
`${API_URL}/api/purchases/admin/all`
);


const data =
await response.json();


if(data.success){

setPurchases(
Array.isArray(data.purchases)
?
data.purchases
:
[]
);

}


}catch(error){

console.log(
"Sales load error",
error
);


}
finally{

setLoadingSales(false);

}

};


loadPurchases();


},[API_URL]);
  /* =========================
     FILTER PRODUCTS
  ========================= */

  const filteredProducts =
    useMemo(() => {
      const searchValue =
        search.trim().toLowerCase();

      return productsData.filter(
        (product) => {
          const matchesFilter =
            filter === "All" ||
            product.type === filter;

          const matchesSearch =
            searchValue === "" ||
            product.name
              .toLowerCase()
              .includes(searchValue) ||
            product.category
              .toLowerCase()
              .includes(searchValue) ||
            String(product.price).includes(
              searchValue
            ) ||
            String(product.id).includes(
              searchValue
            );

          return (
            matchesFilter &&
            matchesSearch
          );
        }
      );
    }, [filter, search]);

  /* =========================
     PRODUCT SALES COUNT
  ========================= */

  const getSalesCount = (
  productId:number
)=>{

return purchases.filter(
(purchase)=>

String(
purchase.productId ||
purchase.product?._id ||
purchase.id
)

===

String(productId)

).length;


};

  return (
    <main className="admin-products-page">

      {/* HEADER */}

      <header className="admin-products-header">

        <button
          type="button"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          <ArrowLeft size={21} />
        </button>

        <div>
          <h1>Products</h1>
          <p>Manage application products</p>
        </div>

        <span>
          <Package size={20} />
        </span>

      </header>

      {/* STATS */}

      <section className="admin-products-stats">

        <article>
          <div>
            <Package size={19} />
          </div>

          <span>
            Total Products
          </span>

          <strong>
            {productsData.length}
          </strong>
        </article>

        <article>
          <div>
            <Package size={19} />
          </div>

          <span>
            Daily Products
          </span>

          <strong>
            {dailyCount}
          </strong>
        </article>

        <article>
          <div>
            <ShoppingBag size={19} />
          </div>

          <span>
            Welfare
          </span>

          <strong>
            {welfareCount}
          </strong>
        </article>

      </section>

      {/* SEARCH */}

      <section className="admin-products-tools">

        <div className="admin-products-search">

          <Search size={17} />

          <input
            type="text"
            value={search}
            placeholder="Search product, category or price..."
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>

        {/* FILTER */}

        <div className="admin-products-filters">

          {(
            [
              "All",
              "Daily",
              "Welfare",
            ] as FilterType[]
          ).map((item) => (
            <button
              type="button"
              key={item}
              className={
                filter === item
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter(item)
              }
            >
              {item}
            </button>
          ))}

        </div>

      </section>

      {/* LIST */}

      <section className="admin-products-card">

        <div className="admin-products-title">

          <div>
            <h2>
              Product List
            </h2>

            <p>
              {filteredProducts.length}
              {" "}products found
            </p>
          </div>

        </div>

        {filteredProducts.length === 0 ? (

          <div className="admin-products-empty">

            <Package size={36} />

            <strong>
              No Products Found
            </strong>

            <span>
              Try another search or filter.
            </span>

          </div>

        ) : (

          <div className="admin-products-list">

            {filteredProducts.map(
              (product) => (

                <article
                  className="admin-product-item"
                  key={product.id}
                >

                  {/* IMAGE */}

                  <div className="admin-product-image">

                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                    <Package size={28} />

                  </div>

                  {/* INFO */}

                  <div className="admin-product-info">

                    <div className="admin-product-name">

                      <strong>
                        {product.name}
                      </strong>

                      {product.badge && (
                        <small>
                          {product.badge}
                        </small>
                      )}

                    </div>

                    <span>
                      {product.category}
                    </span>

                    <span>
                      {product.validity}
                    </span>

                    <div className="admin-product-meta">

                      <small>
                        {product.type}
                      </small>

                      <small>
                        {
loadingSales
?
"Loading..."
:
getSalesCount(product.id)
}
{" "}Sales
                      </small>

                    </div>

                  </div>

                  {/* PRICE */}

                  <div className="admin-product-right">

                    <strong>
                      ₹
                      {product.price.toLocaleString(
                        "en-GB"
                      )}
                    </strong>

                    <span>
                      #{product.id}
                    </span>

                  </div>

                </article>
              )
            )}

          </div>
        )}

      </section>

    </main>
  );
}

export default AdminProducts;