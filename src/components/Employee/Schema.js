
export const employeeSchema = async (data) => {
    let errors = {}
    
    if (!data.first_name) {
        errors.first_name = "first name is required"
    }

    if (!data.last_name) {
        errors.last_name = "last name is required"
    }

    if (!data.email) {
        errors.email = "Email is required"
    }


    return errors
}
