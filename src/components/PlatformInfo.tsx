import { X, Info } from "lucide-react";
import "../PlatformInfo.css";


type Props = {
  close:()=>void;
};


const PlatformInfo = ({close}:Props)=>{


return (

<div className="platform-overlay">


<div className="platform-box">


<div className="platform-header">

<h2>
<Info size={20}/>
Platform Info
</h2>


<button onClick={close}>
<X size={20}/>
</button>

</div>



<div className="platform-row">
<span>Launch Time:</span>
<b>August 10, 2026</b>
</div>


<div className="platform-row">
<span>Sign-up Bonus:</span>
<b>₹10</b>
</div>



<div className="platform-row">
<span>Daily Gift:</span>
<b>₹10 - ₹200</b>
</div>



<div className="platform-row">
<span>Commission:</span>
<b>Level 1: 50%</b>
</div>



<div className="platform-row">
<span>Min Withdrawal:</span>
<b>₹180 - ₹10000</b>
</div>



<div className="platform-row">
<span>Withdrawals:</span>
<b>24 Hours</b>
</div>



<button className="platform-btn">

🌐 Visit Website

</button>


</div>


</div>

)

}


export default PlatformInfo;