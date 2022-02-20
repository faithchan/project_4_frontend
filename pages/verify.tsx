import React, {useState} from 'react'
import emailjs from "emailjs-com"

const verify = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [wallet, setWallet] = useState('');
    const [description, setDescription] = useState('');
    const [formSent, setFormSent] = useState(false);

    const submit = () => {
        if (name && email && wallet && description) {
            const serviceId = 'service_gyzxz0u';
            const templateId = 'template_4im6s3r';
            const userId = 'user_yHG3d36ZhhPAyUiiOiHwd';
            const templateParams = {
                name,
                email,
                wallet,
                description
            };

            emailjs.send(serviceId, templateId, templateParams, userId)
                .then(response => console.log(response))
                .then(error => console.log(error));
            setName('');
            setEmail('');
            setWallet('')
            setDescription('');
            setFormSent(true);
        } else {
            alert('Please fill in all fields.');
        }
    }
   const isValidEmail = (email:any) => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
};

    return (
      
        <div className="max-w-xs w-full p-10 bg-gray-50 rounded-xl m-auto sm:max-w-xs md:max-w-lg ">
		<div className="text-center ">
        <h1 className="text-blue-400 font-serif text-4xl">Get in touch!</h1>
			<p className="mt-2 text-sm font-sanserif text-blue-400 tracking-wider">Submit your details to get verified</p>
		</div>
        <form className="mt-6 space-y-3" action="#" method="POST ">
                    <div className="grid grid-cols-1 space-y-2">

                            <label className="text-sm font-bold text-gray-500 tracking-wide">Your Name</label>
                            <input className="text-base p-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white" type="text" placeholder="John Doe" value={name} onChange={e=>setName(e.target.value)}/>
                        
                            <label className="text-sm bg-gray-100font-bold text-gray-500 tracking-wide">Your Email</label>
                            <input className="text-base p-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white" type="email" placeholder="mail@gmail.com" value={email} onChange={e => setEmail(e.target.value)}/>
                            
                            <label className="text-sm font-bold text-gray-500 tracking-wide">Wallet Address</label>
                            <input className="text-base p-2 border bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white" type="url" placeholder="0x" value={wallet} onChange={e => setWallet(e.target.value)}/>
                            
                            <label className="text-sm font-bold text-gray-500 tracking-wide ">Description</label>
                            <textarea className="w-full min-h-[100px] max-h-[300px] bg-gray-50 h-28 appearance-none block bg-grey-lighter text-grey-darker border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white py-4 px-4" placeholder="Brief write up of your recipe ..." spellCheck="false" value={description} onChange={e => setDescription(e.target.value)} ></textarea>
                    
                    </div>
                    
                            <p className="text-sm text-gray-300">
                                <span>By submitting, you agree to sharing of personal information.</span>
                            </p>
                    <div className="justify-center">
                    <button className="my-5 w-full flex justify-center bg-blue-400 hover:bg-blue-450 text-white tracking-widest font-sanserif py-2 px-4 rounded-full text-xs mt-4 mb-2" onClick={submit}>
                           Submit
                        </button>
                        {formSent ? <h2 className="text-sm text-blue-400">Thank you for your message, we will be in touch in no time!</h2> : ""}
                    </div>
        </form>
	</div>)

}

export default verify
