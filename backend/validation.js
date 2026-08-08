const VALID_COVER_TYPES = ["Single", "Couple", "Family"];

const VALID_COVER_HISTORIES = [
    "Yes",
    "No",
    "Not sure",
];

const VALID_HOSPITAL_COVERS = [
    "None",
    "Basic",
    "Bronze",
    "Silver",
    "Gold",
];

const VALID_EXTRAS_COVERS = [
    "None",
    "Basic",
    "Standard",
    "Premium",
];

const VALID_PAYMENT_FREQUENCIES = [
    "Monthly",
    "Yearly",
];

function validateQuoteInput(data) {
    const errors = [];

    /*
     * Convert incoming values into suitable types.
     * Form values often arrive as strings.
     */
    const applicant1Age = Number(data.applicant1_age);
    const applicant2Age =
        data.applicant2_age === null ||
        data.applicant2_age === undefined ||
        data.applicant2_age === ""
            ? null
            : Number(data.applicant2_age);

    const annualDiscount = Number(data.annual_discount);

    const customerName =
        typeof data.customer_name === "string"
            ? data.customer_name.trim()
            : "";

    const notes =
        typeof data.notes === "string" && data.notes.trim()
            ? data.notes.trim()
            : null;

    // Customer name
    if (!customerName) {
        errors.push("Customer name is required.");
    }

    // Cover type
    if (!VALID_COVER_TYPES.includes(data.cover_type)) {
        errors.push(
            "Cover type must be Single, Couple, or Family."
        );
    }

    // Applicant 1 age
    if (
        !Number.isInteger(applicant1Age) ||
        applicant1Age < 18 ||
        applicant1Age > 100
    ) {
        errors.push(
            "Applicant 1 age must be a whole number between 18 and 100."
        );
    }

    // Applicant 1 hospital history
    if (
        !VALID_COVER_HISTORIES.includes(
            data.applicant1_cover_history
        )
    ) {
        errors.push(
            "Applicant 1 hospital cover history must be Yes, No, or Not sure."
        );
    }

    const requiresApplicant2 =
        data.cover_type === "Couple" ||
        data.cover_type === "Family";

    // Applicant 2 validation for Couple or Family
    if (requiresApplicant2) {
        if (
            !Number.isInteger(applicant2Age) ||
            applicant2Age < 18 ||
            applicant2Age > 100
        ) {
            errors.push(
                "Applicant 2 age is required and must be a whole number between 18 and 100."
            );
        }

        if (
            !VALID_COVER_HISTORIES.includes(
                data.applicant2_cover_history
            )
        ) {
            errors.push(
                "Applicant 2 hospital cover history is required and must be Yes, No, or Not sure."
            );
        }
    }

    // Hospital cover
    if (
        !VALID_HOSPITAL_COVERS.includes(
            data.hospital_cover
        )
    ) {
        errors.push(
            "Hospital cover must be None, Basic, Bronze, Silver, or Gold."
        );
    }

    // Extras cover
    if (
        !VALID_EXTRAS_COVERS.includes(
            data.extras_cover
        )
    ) {
        errors.push(
            "Extras cover must be None, Basic, Standard, or Premium."
        );
    }

    // Payment frequency
    if (
        !VALID_PAYMENT_FREQUENCIES.includes(
            data.payment_frequency
        )
    ) {
        errors.push(
            "Payment frequency must be Monthly or Yearly."
        );
    }

    // Annual discount
    if (
        !Number.isFinite(annualDiscount) ||
        annualDiscount < 0 ||
        annualDiscount > 10
    ) {
        errors.push(
            "Annual-payment discount must be between 0 and 10."
        );
    }

    /*
     * Return cleaned data.
     * Applicant 2 values must be null for Single cover.
     */
    const cleanedQuote = {
        customer_name: customerName,
        cover_type: data.cover_type,
        applicant1_age: applicant1Age,
        applicant1_cover_history:
            data.applicant1_cover_history,

        applicant2_age: requiresApplicant2
            ? applicant2Age
            : null,

        applicant2_cover_history: requiresApplicant2
            ? data.applicant2_cover_history
            : null,

        hospital_cover: data.hospital_cover,
        extras_cover: data.extras_cover,
        payment_frequency: data.payment_frequency,
        annual_discount: annualDiscount,
        notes,
    };

    return {
        isValid: errors.length === 0,
        errors,
        cleanedQuote,
    };
}

module.exports = {
    validateQuoteInput,
};