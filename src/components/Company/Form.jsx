import { useState, useEffect } from 'react'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Button,
    Input,
    Image,
} from '@chakra-ui/react'


import { createCompany, updateCompany } from '@/lib/actions'
import { companySchema } from './Schema';

export default function Form({ isOpen, setOpen, onCompanyAdded, companyToEdit }) {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        website: '',
        logo: null,
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle logo change and preview
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                logo: file,
            }));
            setLogoPreview(URL.createObjectURL(file)); // Show logo preview
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate the form data
        const validationErrors = await companySchema(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Set errors state
            return; // Stop form submission if there are validation errors
        }

        const { name, email, website, logo } = formData;

        const data = new FormData();
        data.append('name', name);
        data.append('email', email);
        data.append('website', website);
        if (logo) data.append('logo', logo); // Attach logo file
        try {
            if (companyToEdit) {
                await updateCompany(companyToEdit?.id, data); // Edit company
            } else {
                createCompany(data); // Add new company
            }
            onCompanyAdded && onCompanyAdded();
            setOpen(false); // Close the dialog on success

        } catch (error) {
            console.error('Error creating company:', error);
        }
    };

    useEffect(() => {
        if (companyToEdit) {
            // Populate form data if editing
            setFormData({
                name: companyToEdit.name,
                email: companyToEdit.email,
                website: companyToEdit.website,
                logo: null,
            });
            setLogoPreview(`http://localhost:8000${companyToEdit.logo}`); // Show existing logo
        } else {
            // Clear form data if adding
            setFormData({
                name: '',
                email: '',
                website: '',
                logo: null,
            });
            setLogoPreview(null);
        }
    }, [companyToEdit]);

    return (
        <>

            <AlertDialog
                isOpen={isOpen}
                onClose={() => setOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            {companyToEdit ? 'Edit Company' : 'Add Company'}
                        </AlertDialogHeader>
                        <AlertDialogCloseButton
                            onClick={() => setOpen(!isOpen)}
                        />

                        <AlertDialogBody>
                            <FormControl isInvalid={errors.email}>
                                <FormLabel>Email address<span style={{ color: 'red' }}> *</span></FormLabel>
                                <Input type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    required />
                                <FormHelperText>We'll never share your email.</FormHelperText>
                                {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
                            </FormControl>
                            <FormControl isInvalid={errors.name}>
                                <FormLabel>Name<span style={{ color: 'red' }}> *</span></FormLabel>
                                <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required />
                                {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
                            </FormControl>
                            <FormControl isInvalid={errors.website}>
                                <FormLabel>Website</FormLabel>
                                <Input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    required />
                                {errors.website && <FormErrorMessage>{errors.website}</FormErrorMessage>}
                            </FormControl>
                            <FormControl isInvalid={errors.logo}>
                                <FormLabel>Logo</FormLabel>
                                <Input type="file" name="logo" accept="image/*" onChange={handleLogoChange} />
                                {errors.logo && <FormErrorMessage>{errors.logo}</FormErrorMessage>}
                                {logoPreview && (
                                    <Image
                                        src={logoPreview}
                                        alt="LogoPreview"
                                        boxSize="100px"
                                        objectFit="content"
                                        mt={2}
                                    />
                                )}
                            </FormControl>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={() => setOpen(!isOpen)}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={handleSubmit} ml={3}>
                                {companyToEdit ? 'Update' : 'Add'}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}