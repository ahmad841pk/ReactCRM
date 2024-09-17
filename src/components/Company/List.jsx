'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCompanies, deleteCompany } from '../../lib/actions';
import Form from './Form';
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import { Spinner } from '@chakra-ui/react'
import Pagination from '../Pagination';

const CompanyTable = () => {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [metaPagination, setMetaPagination] = useState({})

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await getCompanies(page);
      setCompanies(data?.data);
      setMetaPagination(data?.meta?.pagination);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page]);

  const handleAddCompany = () => {
    setCompanyToEdit(null);
    setFormOpen(true);
  }

  const handleEditCompany = (company) => {
    setCompanyToEdit(company); // Set company to edit
    setFormOpen(true); // Open form in edit mode
  };

  const handleDeleteCompany = async (id) => {
    try {
      setDeletingId(id);
      await deleteCompany(id); // Call the API to delete the company
      // After successful deletion, filter out the deleted company from the list
      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company.id !== id)
      );
      setDeletingId(null);
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };


  const handleCompanyAdded = () => {
    if (page > 1) {
      setPage(1);
    } else {
      fetchCompanies();  // Refetch the companies
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
            <h1 className="text-base font-semibold leading-6 text-gray-900">Companies</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the Companies.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => handleAddCompany()}
            >
              Add Company
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
                      Logo
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Website
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {companies?.map((company) => (
                    <tr key={company.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        <Image
                          className="dark:invert"
                          src={`http://localhost:8000${company.logo}`}
                          alt="Company_logo"
                          width={60}
                          height={60}
                          priority
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{company.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{company.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{company.website}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-0">
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => handleEditCompany(company)}
                        >
                          <PencilIcon className="h-5 w-5" aria-hidden="true" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-900 ml-2"
                          onClick={() => handleDeleteCompany(company.id)}
                        >
                          {deletingId === company.id ? (
                            <Spinner color='red.500' /> // Show spinner for only the company being deleted
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
      <Form isOpen={formOpen} setOpen={setFormOpen} onCompanyAdded={handleCompanyAdded} companyToEdit={companyToEdit} />     </>
  );
};

export default CompanyTable;
