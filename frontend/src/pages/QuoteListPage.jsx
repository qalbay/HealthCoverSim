import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Alert,
    Button,
    ButtonGroup,
    Card,
    Container,
    Spinner,
    Table,
} from "react-bootstrap";

import {
    createQuote,
    deleteQuote,
    getQuotes,
    updateQuote,
} from "../api/quotes";

import QuoteFormModal from "../components/QuoteFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import {
    FaEye,
    FaPen,
    FaTrash,
} from "react-icons/fa";

function QuoteListPage() {
    const [quotes, setQuotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageError, setPageError] = useState("");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [quoteToEdit, setQuoteToEdit] = useState(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [quoteToDelete, setQuoteToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadQuotes();
    }, []);

    async function loadQuotes() {
        try {
            setIsLoading(true);
            setPageError("");

            const response = await getQuotes();
            setQuotes(response.data);
        } catch (error) {
            console.error(error);

            setPageError(
                "The quote list could not be loaded."
            );
        } finally {
            setIsLoading(false);
        }
    }

    function openCreateModal() {
        setQuoteToEdit(null);
        setIsFormOpen(true);
    }

    function openEditModal(quote) {
        setQuoteToEdit(quote);
        setIsFormOpen(true);
    }

    function closeFormModal() {
        setIsFormOpen(false);
        setQuoteToEdit(null);
    }

    async function handleSaveQuote(formData) {
        if (quoteToEdit) {
            await updateQuote(quoteToEdit.id, formData);
        } else {
            await createQuote(formData);
        }

        closeFormModal();
        await loadQuotes();
    }

    function openDeleteModal(quote) {
        setQuoteToDelete(quote);
        setIsDeleteOpen(true);
    }

    function closeDeleteModal() {
        setIsDeleteOpen(false);
        setQuoteToDelete(null);
    }

    async function handleDeleteQuote() {
        if (!quoteToDelete) {
            return;
        }

        try {
            setIsDeleting(true);
            setPageError("");

            await deleteQuote(quoteToDelete.id);

            closeDeleteModal();
            await loadQuotes();
        } catch (error) {
            console.error(error);

            setPageError(
                error.response?.data?.error ||
                "The quote could not be deleted."
            );
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Container className="py-5">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="mb-1">
                        HealthCoverSim
                    </h1>

                    <p className="text-muted mb-0">
                        Private health insurance quote
                        simulator
                    </p>
                </div>

                <Button
                    variant="primary"
                    onClick={openCreateModal}
                >
                    Add New Quote
                </Button>
            </div>

            {pageError && (
                <Alert variant="danger">
                    {pageError}
                </Alert>
            )}

            {isLoading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" />

                    <p className="mt-3 mb-0">
                        Loading quotes...
                    </p>
                </div>
            ) : quotes.length === 0 ? (
                <Card className="text-center shadow-sm">
                    <Card.Body className="py-5">
                        <Card.Title>
                            No quotes found
                        </Card.Title>

                        <Card.Text className="text-muted">
                            Select Add New Quote to create
                            the first record.
                        </Card.Text>

                        <Button
                            variant="primary"
                            onClick={openCreateModal}
                        >
                            Add New Quote
                        </Button>
                    </Card.Body>
                </Card>
            ) : (
                <Card className="shadow-sm">
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <Table
                                hover
                                striped
                                className="mb-0 align-middle"
                            >
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Cover type</th>
                                        <th>Hospital</th>
                                        <th>Extras</th>
                                        <th>Payment</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {quotes.map((quote) => (
                                        <tr key={quote.id}>
                                            <td>
                                                {
                                                    quote.customer_name
                                                }
                                            </td>

                                            <td>
                                                {
                                                    quote.cover_type
                                                }
                                            </td>

                                            <td>
                                                {
                                                    quote.hospital_cover
                                                }
                                            </td>

                                            <td>
                                                {
                                                    quote.extras_cover
                                                }
                                            </td>

                                            <td>
                                                {
                                                    quote.payment_frequency
                                                }
                                            </td>

                                            <td>
                                                {new Date(
                                                    quote.created_at
                                                ).toLocaleDateString(
                                                    "en-AU"
                                                )}
                                            </td>

                                            <td>
                                                <ButtonGroup size="sm">
                                                    <Button
                                                        as={Link}
                                                        to={`/quotes/${quote.id}`}
                                                        variant="outline-primary"
                                                        title="View quote"
                                                        aria-label={`View quote for ${quote.customer_name}`}
                                                    >
                                                        <FaEye />
                                                    </Button>

                                                    <Button
                                                        variant="outline-secondary"
                                                        onClick={() => openEditModal(quote)}
                                                        title="Edit quote"
                                                        aria-label={`Edit quote for ${quote.customer_name}`}
                                                    >
                                                        <FaPen />
                                                    </Button>

                                                    <Button
                                                        variant="outline-danger"
                                                        onClick={() => openDeleteModal(quote)}
                                                        title="Delete quote"
                                                        aria-label={`Delete quote for ${quote.customer_name}`}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            )}

            <QuoteFormModal
                isOpen={isFormOpen}
                quoteToEdit={quoteToEdit}
                onClose={closeFormModal}
                onSubmit={handleSaveQuote}
            />

            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                customerName={
                    quoteToDelete?.customer_name || ""
                }
                isDeleting={isDeleting}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteQuote}
            />
        </Container>
    );
}

export default QuoteListPage;