import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { use } from 'react';
import * as yup from 'yup';

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}


// 👇 Here you will create your schema.
const formSchema = yup.object().shape({
  fullName: yup
    .string()
    .trim()
    .required('Full name is required')
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: yup
    .string()
    .required('Must select size')
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect),
  toppings: yup.array().of(yup.string()),
});

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', name: 'Pepperoni' },
  { topping_id: '2', name: 'Green Peppers' },
  { topping_id: '3', name: 'Pineapple' },
  { topping_id: '4', name: 'Mushrooms' },
  { topping_id: '5', name: 'Ham' },
]


const initailErrors = () => ({
    fullName: "",
    size: "",
    
})


const initailValues = () => ({
  fullName: "",
  size: "",
  toppings: [],
});


export default function Form() {
  const [values, setValues] = useState(initailValues())
  const [errors, setErrors] = useState(initailErrors())
  const [success, setSuccess] = useState()
  const [failure, setFailure] = useState()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    formSchema.isValid(values).then(setEnabled)
  },[values])


  const validateField = (name, value) => {
    yup.reach(formSchema, name)
      .validate(value)
      .then(() => {
        // Clear the error for this field
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      })
      .catch((err) => {
        // Set the error message for this field
        setErrors((prevErrors) => ({ ...prevErrors, [name]: err.message }));
      });
  };
  
  const onChange = (evt) => {
    let { name, value, type } = evt.target;
    
    if (type === "checkbox") {
      // Checkbox handling logic (for toppings)
      setValues((prevValues) => ({
        ...prevValues,
        toppings: evt.target.checked
          ? [...prevValues.toppings, value]
          : prevValues.toppings.filter((id) => id !== value),
      }));
    } else {
      // Update the values and validate the field
      setValues((prevValues) => ({ ...prevValues, [name]: value }));
      validateField(name, value);
    }
  };
  


  const onSubmit = evt => {
    evt.preventDefault()

    axios.post('http://localhost:9009/api/order', { ...values })
    .then(res => {
      setSuccess(res.data.message || 'Thank you for your order!');
      setValues(initailValues())
    })
    .catch(err => {
      setFailure(err.response?.data?.message || 'Something went wrong');
    });


    
  }

  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {/*{success && <div className='success'>Thank you for your order!</div>}*/}
      {success && <div className='success'>{success}</div>}

      {/* {failure && <div className='failure'>Something went wrong</div>}*/}

         {failure && <div className='failure'>{failure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
           onChange={onChange} 
           value={values.fullName}
           placeholder="Type
           full name" 
           id="fullName" 
           name='fullName'
           type="text" />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select
           onChange={onChange} value={values.size}
           id="size"
           name='size'>
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map(topping => (
          <label key={topping.topping_id}>
          <input
          type="checkbox"
          name="toppings"
          value={topping.topping_id}
          checked={values.toppings.includes(topping.topping_id)}
          onChange={onChange}
        />
           {topping.name}
          </label>
        ))}
      
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={!enabled} />
    </form>
  )
}
