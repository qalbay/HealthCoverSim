import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Col,
    Form,
    Modal,
    Row,
} from "react-bootstrap";

const EMPTY_FORM = {
    customer_name: "",
    cover_type: "Single",
    applicant1_age: "",
    applicant1_cover_history: "Yes",
    applicant2_age: "",
    applicant2_cover_history: "Yes",
    hospital_cover: "None",
    extras_cover: "None",
    payment_frequency: "Monthly",
    annual_discount: "0",
    notes: "",
};

function QuoteFormModal({
    isOpen,
    quoteToEdit,
    onClose,
    onSubmit,
}) {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const isEditing = Boolean(quoteToEdit);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (quoteToEdit) {
            setFormData({
                customer_name: quoteToEdit.customer_name ?? "",
                cover_type: quoteToEdit.cover_type ?? "Single",
                applicant1_age:
                    quoteToEdit.applicant1_age?.toString() ?? "",
                applicant1_cover_history:
                    quoteToEdit.applicant1_cover_history ?? "Yes",
                applicant2_age:
                    quoteToEdit.applicant2_age?.toString() ?? "",
                applicant2_cover_history:
                    quoteToEdit.applicant2_cover_history ?? "Yes",
                hospital_cover:
                    quoteToEdit.hospital_cover ?? "None",
                extras_cover:
                    quoteToEdit.extras_cover ?? "None",
                payment_frequency:
                    quoteToEdit.payment_frequency ?? "Monthly",
                annual_discount:
                    quoteToEdit.payment_frequency === "Yearly"
                        ? quoteToEdit.annual_discount?.toString() ?? "0"
                        : "0",
                notes: quoteToEdit.notes ?? "",
            });
        } else {
            setFormData(EMPTY_FORM);
        }

        setFieldErrors({});
        setGeneralError("");
    }, [isOpen, quoteToEdit]);

    const showApplicant2 =
        formData.cover_type === "Couple" ||
        formData.cover_type === "Family";

    function clearFieldError(fieldName) {
        setFieldErrors((current) => ({
            ...current,
            [fieldName]: "",
        }));
    }

    function handleChange(event) {
        const { name, value } = event.target;

        clearFieldError(name);
        setGeneralError("");

        if (name === "cover_type") {
            setFormData((current) => ({
                ...current,
                cover_type: value,
                applicant2_age:
                    value === "Single"
                        ? ""
                        : current.applicant2_age,
                applicant2_cover_history:
                    value === "Single"
                        ? "Yes"
                        : current.applicant2_cover_history,
            }));

            return;
        }

        if (
            name === "payment_frequency" &&
            value === "Monthly"
        ) {
            setFormData((current) => ({
                ...current,
                payment_frequency: value,
                annual_discount: "0",
            }));

            clearFieldError("annual_discount");
            return;
        }

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function handleIntegerInput(event) {
        const { name, value } = event.target;

        // Allow only digits.
        const numericValue = value.replace(/\D/g, "");

        setFormData((current) => ({
            ...current,
            [name]: numericValue,
        }));

        clearFieldError(name);
        setGeneralError("");
    }

    function handleDiscountInput(event) {
        const { value } = event.target;

        // Allows numbers such as 5, 5.5 or 10.
        if (value === "" || /^\d{0,2}(\.\d{0,2})?$/.test(value)) {
            setFormData((current) => ({
                ...current,
                annual_discount: value,
            }));

            clearFieldError("annual_discount");
            setGeneralError("");
        }
    }

    function validateForm() {
        const errors = {};

        const applicant1Age = Number(formData.applicant1_age);
        const applicant2Age = Number(formData.applicant2_age);
        const annualDiscount = Number(
            formData.annual_discount
        );

        if (!formData.customer_name.trim()) {
            errors.customer_name =
                "Customer name is required.";
        }

        if (!formData.applicant1_age) {
            errors.applicant1_age =
                "Applicant 1 age is required.";
        } else if (
            !Number.isInteger(applicant1Age) ||
            applicant1Age < 18 ||
            applicant1Age > 100
        ) {
            errors.applicant1_age =
                "Age must be between 18 and 100.";
        }

        if (showApplicant2) {
            if (!formData.applicant2_age) {
                errors.applicant2_age =
                    "Applicant 2 age is required.";
            } else if (
                !Number.isInteger(applicant2Age) ||
                applicant2Age < 18 ||
                applicant2Age > 100
            ) {
                errors.applicant2_age =
                    "Age must be between 18 and 100.";
            }

            if (!formData.applicant2_cover_history) {
                errors.applicant2_cover_history =
                    "Applicant 2 cover history is required.";
            }
        }

        if (formData.payment_frequency === "Yearly") {
            if (formData.annual_discount === "") {
                errors.annual_discount =
                    "Annual discount is required.";
            } else if (
                !Number.isFinite(annualDiscount) ||
                annualDiscount < 0 ||
                annualDiscount > 10
            ) {
                errors.annual_discount =
                    "Discount must be between 0 and 10.";
            }
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const cleanedData = {
            customer_name: formData.customer_name.trim(),
            cover_type: formData.cover_type,
            applicant1_age: Number(
                formData.applicant1_age
            ),
            applicant1_cover_history:
                formData.applicant1_cover_history,

            applicant2_age: showApplicant2
                ? Number(formData.applicant2_age)
                : null,

            applicant2_cover_history: showApplicant2
                ? formData.applicant2_cover_history
                : null,

            hospital_cover: formData.hospital_cover,
            extras_cover: formData.extras_cover,
            payment_frequency:
                formData.payment_frequency,

            annual_discount:
                formData.payment_frequency === "Yearly"
                    ? Number(formData.annual_discount)
                    : 0,

            notes: formData.notes.trim(),
        };

        try {
            setIsSaving(true);
            setGeneralError("");

            await onSubmit(cleanedData);
        } catch (error) {
            const backendErrors =
                error.response?.data?.errors;

            if (Array.isArray(backendErrors)) {
                setGeneralError(backendErrors.join(" "));
            } else {
                setGeneralError(
                    error.response?.data?.error ||
                        "The quote could not be saved."
                );
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Modal
            show={isOpen}
            onHide={onClose}
            size="lg"
            centered
            backdrop="static"
        >
            <Form onSubmit={handleSubmit} noValidate>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {isEditing
                            ? "Edit Quote"
                            : "Create Quote"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {generalError && (
                        <Alert variant="danger">
                            {generalError}
                        </Alert>
                    )}

                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>
                                    Customer name
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    name="customer_name"
                                    value={
                                        formData.customer_name
                                    }
                                    onChange={handleChange}
                                    isInvalid={
                                        Boolean(
                                            fieldErrors.customer_name
                                        )
                                    }
                                    autoFocus
                                />

                                <Form.Control.Feedback type="invalid">
                                    {
                                        fieldErrors.customer_name
                                    }
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>
                                    Cover type
                                </Form.Label>

                                <Form.Select
                                    name="cover_type"
                                    value={formData.cover_type}
                                    onChange={handleChange}
                                >
                                    <option value="Single">
                                        Single
                                    </option>
                                    <option value="Couple">
                                        Couple
                                    </option>
                                    <option value="Family">
                                        Family
                                    </option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>
                                    Applicant 1 age
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    inputMode="numeric"
                                    name="applicant1_age"
                                    value={
                                        formData.applicant1_age
                                    }
                                    onChange={handleIntegerInput}
                                    placeholder="Enter age"
                                    maxLength={3}
                                    isInvalid={
                                        Boolean(
                                            fieldErrors.applicant1_age
                                        )
                                    }
                                />

                                <Form.Control.Feedback type="invalid">
                                    {
                                        fieldErrors.applicant1_age
                                    }
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>
                                    Applicant 1 hospital cover
                                    history
                                </Form.Label>

                                <Form.Select
                                    name="applicant1_cover_history"
                                    value={
                                        formData.applicant1_cover_history
                                    }
                                    onChange={handleChange}
                                >
                                    <option value="Yes">
                                        Yes
                                    </option>
                                    <option value="No">
                                        No
                                    </option>
                                    <option value="Not sure">
                                        Not sure
                                    </option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        {showApplicant2 && (
                            <>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            Applicant 2 age
                                        </Form.Label>

                                        <Form.Control
                                            type="text"
                                            inputMode="numeric"
                                            name="applicant2_age"
                                            value={
                                                formData.applicant2_age
                                            }
                                            onChange={
                                                handleIntegerInput
                                            }
                                            placeholder="Enter age"
                                            maxLength={3}
                                            isInvalid={
                                                Boolean(
                                                    fieldErrors.applicant2_age
                                                )
                                            }
                                        />

                                        <Form.Control.Feedback type="invalid">
                                            {
                                                fieldErrors.applicant2_age
                                            }
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            Applicant 2 hospital
                                            cover history
                                        </Form.Label>

                                        <Form.Select
                                            name="applicant2_cover_history"
                                            value={
                                                formData.applicant2_cover_history
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            isInvalid={
                                                Boolean(
                                                    fieldErrors.applicant2_cover_history
                                                )
                                            }
                                        >
                                            <option value="Yes">
                                                Yes
                                            </option>
                                            <option value="No">
                                                No
                                            </option>
                                            <option value="Not sure">
                                                Not sure
                                            </option>
                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {
                                                fieldErrors.applicant2_cover_history
                                            }
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </>
                        )}

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>
                                    Hospital cover level
                                </Form.Label>

                                <Form.Select
                                    name="hospital_cover"
                                    value={
                                        formData.hospital_cover
                                    }
                                    onChange={handleChange}
                                >
                                    <option value="None">
                                        None
                                    </option>
                                    <option value="Basic">
                                        Basic
                                    </option>
                                    <option value="Bronze">
                                        Bronze
                                    </option>
                                    <option value="Silver">
                                        Silver
                                    </option>
                                    <option value="Gold">
                                        Gold
                                    </option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>
                                    Extras cover level
                                </Form.Label>

                                <Form.Select
                                    name="extras_cover"
                                    value={
                                        formData.extras_cover
                                    }
                                    onChange={handleChange}
                                >
                                    <option value="None">
                                        None
                                    </option>
                                    <option value="Basic">
                                        Basic
                                    </option>
                                    <option value="Standard">
                                        Standard
                                    </option>
                                    <option value="Premium">
                                        Premium
                                    </option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>
                                    Payment frequency
                                </Form.Label>

                                <Form.Select
                                    name="payment_frequency"
                                    value={
                                        formData.payment_frequency
                                    }
                                    onChange={handleChange}
                                >
                                    <option value="Monthly">
                                        Monthly
                                    </option>
                                    <option value="Yearly">
                                        Yearly
                                    </option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>
                                    Annual-payment discount %
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    inputMode="decimal"
                                    name="annual_discount"
                                    value={
                                        formData.annual_discount
                                    }
                                    onChange={
                                        handleDiscountInput
                                    }
                                    disabled={
                                        formData.payment_frequency ===
                                        "Monthly"
                                    }
                                    placeholder="0 to 10"
                                    isInvalid={
                                        Boolean(
                                            fieldErrors.annual_discount
                                        )
                                    }
                                />

                                <Form.Control.Feedback type="invalid">
                                    {
                                        fieldErrors.annual_discount
                                    }
                                </Form.Control.Feedback>

                                {formData.payment_frequency ===
                                    "Monthly" && (
                                    <Form.Text muted>
                                        Annual discount applies
                                        only to yearly payments.
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </Col>

                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label>
                                    Notes
                                </Form.Label>

                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isSaving}
                    >
                        {isSaving
                            ? "Saving..."
                            : isEditing
                              ? "Update Quote"
                              : "Create Quote"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default QuoteFormModal;