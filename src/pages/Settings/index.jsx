

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";
import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'; 
import { updateSettings } from '../../store/settingsSlice';

const Settings = () => {
    const {
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [formData, setFormData] = useState({
        brandName: 'Your brand',
        logo: null, // Use null or an appropriate initial value
        brandColors: {
            primaryColor: '#E91616',
            secondaryColor: '#0031A3',
            white: '#FFFFFF',
            black: '#000000'
        }
    });
    const dispatch= useDispatch();
    const { brandName, logo, brandColors } = useSelector(state => state.settings);

    const handleInputChange = (event) => {
        const { name, value, files } = event.target;

        const updatedData = {
            ...formData,
            brandColors: { ...formData.brandColors }, // Create a new copy of brandColors
        };

        if (files) {
            const reader = new window.FileReader();
            reader.onload = (e) => {
                const blobString = e.target.result;
                updatedData[name] = blobString;
                setFormData(updatedData);
                console.log("updatedData", updatedData);
            };
            reader.readAsDataURL(files[0]);
        } else if (name === 'brandColors') {
            // Handle changes to color inputs
            updatedData.brandColors[value] = updatedData.brandColors[name];
        } else {
            updatedData[name] = value;
        }

        setFormData(updatedData);
        console.log("updatedData", updatedData);
    };


    const onSubmit = async () => {
        try {
            const body = {
                brandName: formData.brandName,
                logo: formData.logo,
                brandColors: {
                    primary: formData.brandColors.primaryColor,
                    secondary: formData.brandColors.secondaryColor,
                    black: "#000000",
                    white: "#FFFFFF"
                },
            };
            console.log("body--", body)
            const headers = {
                // "Content-Type": "application/json",
                Authorization: "Bearer your-access-token",
            };

            const response = await axios.post(
                "http://localhost:5000/settings/createSetting",
                body,
                { headers }
            );

            console.log("respnse Data:", response.data);
            const settings = await response.data;
            toast.success("Settings Updated successfully!");
            dispatch(updateSettings(settings));

            console.log("Success");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            

        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred during settings updation");
                console.log("error-",error)
            }
        }
    };


    return (
        <div className="container" style={{ width: "60%", margin: '0px', paddingTop: '30px' }}>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Change Brand Name</Form.Label>
                    <Form.Control type="text" placeholder="Brand Logo Name" name="brandName" value={formData.brandName}
                        onChange={handleInputChange} style={{width: '50%'}}/><br />
                </Form.Group><br /><br />
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Change Brand Logo</Form.Label>
                    <Form.Control type="file"
                        name="logo"
                        onChange={handleInputChange} /><br />
                </Form.Group><br /><br />
                <Form.Label>Change Brand Colors</Form.Label><br />
                <Row>
                    <Col>
                        <Form.Label>Primary</Form.Label>
                        <Form.Control
                            type="color"
                            name="primaryColor"
                            // defaultValue="#E91616"
                            title="Choose your color"
                            value={formData.brandColors.primaryColor}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Secondary</Form.Label>
                        <Form.Control
                            type="color"
                            name="secondaryColor"
                            // defaultValue="#0031A3"
                            title="Choose your color"
                            value={formData.brandColors.secondaryColor}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Black</Form.Label>
                        <Form.Control
                            type="color"
                            name="Black"
                            // defaultValue="#000000"
                            title="Black"
                            value={formData.brandColors.black}
                            onChange={handleInputChange}
                            disabled
                        />
                    </Col>
                    <Col>
                        <Form.Label>White</Form.Label>
                        <Form.Control
                            type="color"
                            name="white"
                            //    defaultValue="#FFFFFF"
                            title="White"
                            value={formData.brandColors.white}
                            onChange={handleInputChange}
                            disabled
                        />
                    </Col>
                </Row><br /><br /><br />
                <Button type="submit" size="m" style={{backgroundColor: '#174873'}}>Change</Button>
            </Form>
            <br /><br />
        </div>
    );
}

export default Settings;