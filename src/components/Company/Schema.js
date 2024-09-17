
export const companySchema = async (data) => {
    let errors = {}
    
    if (!data.name) {
        errors.name = "Name is required"
    }

    if (!data.email) {
        errors.email = "Email is required"
    }

    if (data.website) {
        try {
            new URL(data.website) // Validate URL
        } catch (error) {
            errors.website = "Website must be a valid URL"
        }
    }

    if (data.logo) {
        // Create a temporary URL for the image file
        const logoURL = URL.createObjectURL(data.logo);
        const logo = new Image();
        logo.src = logoURL;

        // Check image dimensions
        await new Promise((resolve) => {
            logo.onload = () => {
                if (logo.width < 100 || logo.height < 100) {
                    errors.logo = "Logo must be at least 100x100 pixels";
                }
                resolve(); // Continue after checking dimensions
            };

            logo.onerror = (error) => {
                errors.logo = "Invalid image file";
                resolve(); // Continue after detecting an invalid image
            };
        });
    }

    return errors
}
