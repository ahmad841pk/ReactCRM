'use client'
import { useState, useEffect } from 'react';
import { getEmployees, deleteEmployee } from '../../lib/actions';
import Form from './Form';
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import { Spinner } from '@chakra-ui/react'
import Pagination from '../Pagination';

const EmployeeTable = () => {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [metaPagination, setMetaPagination] = useState({})

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees(page);
      setEmployees(data?.data);
      setMetaPagination(data?.meta?.pagination);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  const handleAddEmployee = () => {
    setEmployeeToEdit(null);
    setFormOpen(true);
  }

  const handleEditEmployee = (employee) => {
    setEmployeeToEdit(employee); // Set employee to edit
    setFormOpen(true); // Open form in edit mode
  };

  const handleDeleteEmployee = async (id) => {
    try {
      setDeletingId(id);
      await deleteEmployee(id); // Call the API to delete the employee
      // After successful deletion, filter out the deleted employee from the list
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== id)
      );
      setDeletingId(null);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };


  const handleEmployeeAdded = () => {
    if (page > 1) {
      setPage(1);
    } else {
      fetchEmployees();  // Refetch the employees
    }
  };


  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      <div className="px-10 sm:px-6 lg:px-8 m-10">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Employees</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the Employees.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => handleAddEmployee()}
            >
              Add Employee
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      First Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Last Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      phone
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      company
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employees?.map((employee) => (
                    <tr key={employee.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {employee.first_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.last_name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.phone}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.company?.name}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-0">
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <PencilIcon className="h-5 w-5" aria-hidden="true" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-900 ml-2"
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          {deletingId === employee.id ? (
                            <Spinner color='red.500' /> // Show spinner for only the employee being deleted
                          ) : (
                            <>
                              <TrashIcon className="h-5 w-5" aria-hidden="true" />
                              <span className="sr-only">Delete</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
            <Pagination currentPage={page} setPage={setPage} metaPagination={metaPagination}/>
        </div>
      </div>
      <Form isOpen={formOpen} setOpen={setFormOpen} onEmployeeAdded={handleEmployeeAdded} employeeToEdit={employeeToEdit} />     </>
  );
};

export default EmployeeTable;
