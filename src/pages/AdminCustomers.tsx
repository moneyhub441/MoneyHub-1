import {
  ArrowLeft,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";
import "../css/AdminCustomers.css";

type Customer = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: "Active" | "Blocked";
  joinedAt: string;
};

function AdminCustomers() {
  const navigate = useNavigate();
 


const [customers,setCustomers] =
useState<Customer[]>([]);


const [loading,setLoading] =
useState(true);

  const [search, setSearch] = useState("");

  // =========================
  // LOAD CUSTOMERS
  // =========================

  

  useEffect(()=>{

const loadCustomers =
async()=>{

try{

const response =
await fetch(
`${API_URL}/api/auth`
);


const data =
await response.json();


if(data.success){

setCustomers(
data.users || []
);

}


}catch(error){

console.log(
"Customers error",
error
);

}

finally{

setLoading(false);

}

};


loadCustomers();


},[API_URL]);

  // =========================
  // FILTER
  // =========================

  const filteredCustomers = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name
          .toLowerCase()
          .includes(value) ||
        customer.email
          .toLowerCase()
          .includes(value) ||
        customer.mobile.includes(value)
      );
    });
  }, [customers, search]);

  // =========================
  // COUNTS
  // =========================

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.status === "Active"
    ).length;

  const blockedCustomers =
    customers.filter(
      (customer) =>
        customer.status === "Blocked"
    ).length;

  return (
    <main className="admin-customers-page">

      {/* HEADER */}

      <header className="admin-customers-header">
        <button
          type="button"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          <ArrowLeft size={21} />
        </button>

        <div>
          <h1>Customers</h1>
          <p>Manage registered users</p>
        </div>

        <span>
          <Users size={20} />
        </span>
      </header>

      {/* SUMMARY */}

      <section className="admin-customer-stats">

        <article>
          <div>
            <Users size={20} />
          </div>

          <span>Total Customers</span>

          <strong>
            {customers.length}
          </strong>
        </article>

        <article>
          <div>
            <ShieldCheck size={20} />
          </div>

          <span>Active</span>

          <strong>
            {activeCustomers}
          </strong>
        </article>

        <article>
          <div>
            <UserRound size={20} />
          </div>

          <span>Blocked</span>

          <strong>
            {blockedCustomers}
          </strong>
        </article>

      </section>

      {/* SEARCH */}

      <section className="admin-customer-tools">
        <div className="admin-customer-search">
          <Search size={17} />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search name, email or mobile..."
          />
        </div>
      </section>

      {/* CUSTOMER LIST */}

      <section className="admin-customer-card">

        <div className="admin-customer-title">
          <h2>Customer Accounts</h2>

          <p>
            {filteredCustomers.length} customers found
          </p>
        </div>

        {loading ? (
          <div className="admin-customer-empty">
            <Users size={36} />

            <strong>
Loading Customers...
</strong>

<span>
Please wait.
</span>
          </div>
        ) : (
          <div className="admin-customer-list">

            {filteredCustomers.map(
              (customer) => (
                <article
  className="admin-customer-item"
  key={customer.id}
  onClick={() =>
    navigate(`/admin/customers/${customer.id}`)
  }
>

                  <div className="admin-customer-avatar">
                    <UserRound size={21} />
                  </div>

                  <div className="admin-customer-info">
                    <strong>
                      {customer.name}
                    </strong>

                    <span>
                      {customer.mobile}
                    </span>

                    <small>
                      {customer.email}
                    </small>
                  </div>

                  <div className="admin-customer-right">
                    <span
                      className={customer.status.toLowerCase()}
                    >
                      {customer.status}
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

export default AdminCustomers;