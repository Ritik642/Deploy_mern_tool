import React, { useState } from 'react';

const SalesForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        typeOfChaff: '',
        rate: '',
        quantity: ''
    });
    const [response, setResponse] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                setResponse(`Data submitted successfully. Total Quantity: ${data.total_quantity} kg, Total Money: ₹${data.total_money}`);
            } else {
                setResponse(`Error: ${data.error}`);
            }
        } catch (err) {
            setResponse('An error occurred.');
        }
    };

    return (
        <div className="container">
            <h1>Enter Sales Data</h1>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                <input name="typeOfChaff" placeholder="Type of Chaff" value={formData.typeOfChaff} onChange={handleChange} required />
                <input name="rate" type="number" placeholder="Rate (per kg)" value={formData.rate} onChange={handleChange} required />
                <input name="quantity" type="number" placeholder="Quantity (kg)" value={formData.quantity} onChange={handleChange} required />
                <button type="submit">Submit</button>
            </form>
            {response && <div className="response">{response}</div>}
        </div>
    );
};

export default SalesForm;


