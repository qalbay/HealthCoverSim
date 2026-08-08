import { useEffect, useState } from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Container,
    Row,
    Spinner,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import ExplanationSheet from "../components/ExplanationSheet";
import {
    deleteQuote,
    getQuote,
    updateQuote,
} from "../api/quotes";
import QuoteFormModal from "../components/QuoteFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

function QuoteDetailPage() {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { id } = useParams();

    const [quote, setQuote] = useState(null);
    const [calculation, setCalculation] =
        useState(null);
    const [isLoading, setIsLoading] =
        useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadQuote();
    }, [id]);

    async function loadQuote() {
        try {
            setIsLoading(true);
            setError("");

            const response = await getQuote(id);

            setQuote(response.data.quote);
            setCalculation(
                response.data.calculation
            );
        } catch (requestError) {
            console.error(requestError);

            setError(
                requestError.response?.data?.error ||
                "The quote could not be loaded."
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function handleUpdateQuote(formData) {
        await updateQuote(id, formData);

        setIsEditOpen(false);
        await loadQuote();
    }

    async function handleDeleteQuote() {
        try {
            setIsDeleting(true);

            await deleteQuote(id);

            window.location.href = "/quotes";
        } catch (requestError) {
            console.error(requestError);

            setError(
                requestError.response?.data?.error ||
                "The quote could not be deleted."
            );
        } finally {
            setIsDeleting(false);
        }
    }
    if (isLoading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" />

                <p className="mt-3">
                    Loading quote...
                </p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    {error}
                </Alert>

                <Button
                    as={Link}
                    to="/quotes"
                    variant="outline-primary"
                >
                    Back to quotes
                </Button>
            </Container>
        );
    }

    if (!quote || !calculation) {
        return null;
    }

    return (
        <Container className="py-5">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <Button
                        as={Link}
                        to="/quotes"
                        variant="link"
                        className="px-0 mb-2"
                    >
                        ← Back to quotes
                    </Button>

                    <h1 className="mb-1">
                        {quote.customer_name}
                    </h1>

                    <p className="text-muted mb-0">
                        Quote #{quote.id}
                    </p>
                </div>

                <div className="d-flex gap-2">
                    <Button
                        variant="outline-primary"
                        onClick={() => setIsEditOpen(true)}
                    >
                        Edit
                    </Button>


                    <Button
                        variant="outline-danger"
                        onClick={() => setIsDeleteOpen(true)}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm mb-4">
                <Card.Header>
                    <h2 className="h5 mb-0">
                        Quote information
                    </h2>
                </Card.Header>

                <Card.Body>
                    <Row className="g-4">
                        <Col md={4}>
                            <div className="detail-label">
                                Cover type
                            </div>

                            <div>
                                <Badge bg="primary">
                                    {quote.cover_type}
                                </Badge>
                            </div>
                        </Col>

                        <Col md={4}>
                            <div className="detail-label">
                                Hospital cover
                            </div>

                            <div>
                                {quote.hospital_cover}
                            </div>
                        </Col>

                        <Col md={4}>
                            <div className="detail-label">
                                Extras cover
                            </div>

                            <div>
                                {quote.extras_cover}
                            </div>
                        </Col>

                        <Col md={4}>
                            <div className="detail-label">
                                Applicant 1 age
                            </div>

                            <div>
                                {quote.applicant1_age}
                            </div>
                        </Col>

                        <Col md={4}>
                            <div className="detail-label">
                                Applicant 1 cover history
                            </div>

                            <div>
                                {
                                    quote.applicant1_cover_history
                                }
                            </div>
                        </Col>

                        {quote.cover_type !== "Single" && (
                            <>
                                <Col md={4}>
                                    <div className="detail-label">
                                        Applicant 2 age
                                    </div>

                                    <div>
                                        {
                                            quote.applicant2_age
                                        }
                                    </div>
                                </Col>

                                <Col md={4}>
                                    <div className="detail-label">
                                        Applicant 2 cover
                                        history
                                    </div>

                                    <div>
                                        {
                                            quote.applicant2_cover_history
                                        }
                                    </div>
                                </Col>
                            </>
                        )}

                        <Col md={4}>
                            <div className="detail-label">
                                Payment frequency
                            </div>

                            <div>
                                {
                                    quote.payment_frequency
                                }
                            </div>
                        </Col>

                        <Col md={4}>
                            <div className="detail-label">
                                Annual discount
                            </div>

                            <div>
                                {quote.annual_discount}%
                            </div>
                        </Col>

                        <Col xs={12}>
                            <div className="detail-label">
                                Notes
                            </div>

                            <div>
                                {quote.notes ||
                                    "No notes provided."}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <ExplanationSheet
                quote={quote}
                calculation={calculation}
            />

            <QuoteFormModal
                isOpen={isEditOpen}
                quoteToEdit={quote}
                onClose={() => setIsEditOpen(false)}
                onSubmit={handleUpdateQuote}
            />
            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                customerName={quote.customer_name}
                isDeleting={isDeleting}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteQuote}
            />
        </Container>
    );
}

export default QuoteDetailPage;