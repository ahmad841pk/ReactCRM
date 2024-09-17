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
    Select,
} from '@chakra-ui/react'


import { createEmployee, getCompanies, updateEmployee } from '@/lib/actions'
import { employeeSchema } from './Schema';

export default function Form({ isOpen, setOpen, onEmployeeAdded, employeeToEdit }) {

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company_id: null,
    });

    const [companies, setCompanies] = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const fetchCompanies = async () => {
        try {
            setLoadingCompanies(true);
            const data = await getCompanies();
            setCompanies(data?.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setLoadingCompanies(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        if (employeeToEdit) {
            // Populate form data if editing
            setFormData({
                first_name: employeeToEdit.first_name,
                last_name: employeeToEdit.last_name,
                email: employeeToEdit.email,
                phone: employeeToEdit?.phone,
                company_id: employeeToEdit?.comapany_id
            });
        } else {
            // Clear form data if adding
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                company_id: null,
            });
        }
    }, [employeeToEdit]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate the form data
        const validationErrors = await employeeSchema(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Set errors state
            return; // Stop form submission if there are validation errors
        }

        const { first_name, last_name, email, phone, company_id } = formData;

        const data = new FormData();
        data.append('first_name', first_name);
        data.append('last_name', last_name);
        data.append('email', email);
        if (phone) data.append('phone', phone);
        if (company_id) data.append('company_id', company_id);
        try {
            if (employeeToEdit) {
                await updateEmployee(employeeToEdit?.id, data); // Edit employee
            } else {
                createEmployee(data); // Add new employee
            }
            onEmployeeAdded && onEmployeeAdded();
            setOpen(false); // Close the dialog on success

        } catch (error) {
            console.error('Error creating employee:', error);
        }
    };


    return (
        <>

            <AlertDialog
                isOpen={isOpen}
                onClose={() => setOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            {employeeToEdit ? 'Edit Employee' : 'Add Employee'}
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
                            <FormControl isInvalid={errors.first_name}>
                                <FormLabel>First Name<span style={{ color: 'red' }}> *</span></FormLabel>
                                <Input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required />
                                {errors.first_name && <FormErrorMessage>{errors.first_name}</FormErrorMessage>}
                            </FormControl>
                            <FormControl isInvalid={errors.last_name}>
                                <FormLabel>Last Name</FormLabel>
                                <Input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required />
                                {errors.website && <FormErrorMessage>{errors.last_name}</FormErrorMessage>}
                            </FormControl>
                            <FormControl isInvalid={errors.phone}>
                                <FormLabel>Phone</FormLabel>
                                <Input type="text" name="phone" onChange={handleChange}
                                value={formData.phone} />
                                {errors.logo && <FormErrorMessage>{errors.phone}</FormErrorMessage>}
                            </FormControl>

                            <FormControl isInvalid={errors.company_id}>
                                <FormLabel>Company</FormLabel>
                                <Select
                                    name="company_id"
                                    value={formData.company_id || ''}
                                    onChange={handleChange}
                                    placeholder="Select company"
                                >
                                    {loadingCompanies ? (
                                        <option>Loading...</option>
                                    ) : (
                                        companies.map((company) => (
                                            <option key={company.id} value={company.id}>
                                                {company.name}
                                            </option>
                                        ))
                                    )}
                                </Select>
                                {errors.company_id && <FormErrorMessage>{errors.company_id}</FormErrorMessage>}
                            </FormControl>


                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={() => setOpen(!isOpen)}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={handleSubmit} ml={3}>
                                {employeeToEdit ? 'Update' : 'Add'}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}