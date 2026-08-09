import { useEffect, useRef, useState } from "react";
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
    FaArrowRight,
    FaCheckCircle,
    FaEye,
    FaHeart,
    FaHospital,
    FaPen,
    FaShieldAlt,
    FaTrash,
    FaUserFriends,
} from "react-icons/fa";

import {
    createQuote,
    deleteQuote,
    getQuotes,
    updateQuote,
} from "../api/quotes";

import QuoteFormModal from "../components/QuoteFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

function QuoteListPage() {
    const [quotes, setQuotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageError, setPageError] = useState("");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [quoteToEdit, setQuoteToEdit] = useState(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [quoteToDelete, setQuoteToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const quotesSectionRef = useRef(null);

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

    function scrollToQuotes() {
        quotesSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
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
        <>
            {/* STICKY HEADER */}
            <header className="site-header">
                <Container>
                    <div className="header-content">

                        <div className="brand-logo">
                            <span className="brand-main">
                                health
                            </span>
                            <span className="brand-second">
                                cover
                            </span>
                        </div>

                        <nav className="main-nav">
                            <a href="#cover">Health cover</a>
                            <a href="#benefits">Benefits</a>
                            <a href="#quotes">My quotes</a>
                        </nav>

                        <Button
                            className="header-quote-btn"
                            onClick={scrollToQuotes}
                        >
                            Get a quote
                            <FaArrowRight />
                        </Button>

                    </div>
                </Container>
            </header>

            {/* SMALL TOP MESSAGE */}
            <section className="member-strip">
                <Container>
                    <span>
                        Looking for health cover? Get an
                        estimated quote in just a few minutes.
                    </span>
                </Container>
            </section>

            {/* HERO */}
            <section className="hero-section">

                <Container>
                    <div className="hero-grid">

                        <div className="hero-copy">

                            <div className="hero-badge">
                                Simple health cover estimates
                            </div>

                            <h1>
                                Find health cover that
                                <span> works for you.</span>
                            </h1>

                            <p className="hero-description">
                                Compare hospital and extras
                                options and get a clear estimate
                                of your monthly and yearly
                                premium.
                            </p>

                            <div className="hero-actions">

                                <Button
                                    className="hero-primary-btn"
                                    onClick={scrollToQuotes}
                                >
                                    Get a quote
                                    <FaArrowRight />
                                </Button>

                                <Button
                                    variant="outline-light"
                                    className="hero-secondary-btn"
                                    href="#cover"
                                >
                                    Explore cover
                                </Button>

                            </div>

                            <p className="hero-small-text">
                                Quick, simple and obligation
                                free.
                            </p>

                        </div>

                        <div className="hero-visual">

                            <div className="hero-circle hero-circle-one" />
                            <div className="hero-circle hero-circle-two" />

                            <div className="hero-card hero-card-main">

                                <FaHeart className="hero-heart" />

                                <div>
                                    <small>
                                        Your health cover
                                    </small>

                                    <h3>
                                        Made simpler
                                    </h3>

                                    <p>
                                        Hospital + Extras
                                    </p>
                                </div>

                            </div>

                            <div className="hero-floating-card">
                                <FaCheckCircle />

                                <div>
                                    <strong>
                                        Clear estimates
                                    </strong>

                                    <span>
                                        Monthly & yearly
                                    </span>
                                </div>
                            </div>

                        </div>

                    </div>
                </Container>

            </section>

            {/* HOW IT WORKS */}
            <section
                id="cover"
                className="steps-section"
            >
                <Container>

                    <div className="section-heading">

                        <h2>
                            Health cover made simple
                        </h2>

                        <p>
                            Create your quote in a few simple
                            steps.
                        </p>

                    </div>

                    <div className="steps-grid">

                        <div className="step-item">

                            <div className="step-icon">
                                <FaUserFriends />
                            </div>

                            <h3>
                                Tell us about you
                            </h3>

                            <p>
                                Select Single, Couple or Family
                                cover and enter applicant
                                information.
                            </p>

                        </div>

                        <div className="step-item">

                            <div className="step-icon">
                                <FaHospital />
                            </div>

                            <h3>
                                Choose your cover
                            </h3>

                            <p>
                                Select the hospital and extras
                                cover levels that suit your
                                needs.
                            </p>

                        </div>

                        <div className="step-item">

                            <div className="step-icon">
                                <FaShieldAlt />
                            </div>

                            <h3>
                                Get your estimate
                            </h3>

                            <p>
                                See a clear breakdown of
                                hospital, extras, LHC and
                                estimated premiums.
                            </p>

                        </div>

                    </div>

                </Container>
            </section>

            {/* BENEFITS */}
            <section
                id="benefits"
                className="benefits-section"
            >
                <Container>

                    <div className="section-heading">
                        <h2>
                            Why HealthCoverSim?
                        </h2>

                        <p>
                            A simple way to understand how
                            private health insurance premiums
                            can be calculated.
                        </p>
                    </div>

                    <div className="benefits-grid">

                        <Card className="benefit-card">

                            <Card.Body>

                                <div className="benefit-icon">
                                    <FaHospital />
                                </div>

                                <h3>
                                    Hospital cover
                                </h3>

                                <p>
                                    Compare Basic, Bronze,
                                    Silver and Gold hospital
                                    cover estimates.
                                </p>

                            </Card.Body>

                        </Card>

                        <Card className="benefit-card">

                            <Card.Body>

                                <div className="benefit-icon">
                                    <FaHeart />
                                </div>

                                <h3>
                                    Extras cover
                                </h3>

                                <p>
                                    Add optional extras cover
                                    such as Basic, Standard or
                                    Premium.
                                </p>

                            </Card.Body>

                        </Card>

                        <Card className="benefit-card">

                            <Card.Body>

                                <div className="benefit-icon">
                                    <FaShieldAlt />
                                </div>

                                <h3>
                                    Clear breakdown
                                </h3>

                                <p>
                                    See hospital costs, extras,
                                    LHC loading and yearly
                                    discounts separately.
                                </p>

                            </Card.Body>

                        </Card>

                    </div>

                </Container>
            </section>

            {/* QUOTES */}
            <section
                id="quotes"
                ref={quotesSectionRef}
                className="quotes-section"
            >
                <Container>

                    <div className="quotes-heading">

                        <div>

                            <span className="section-kicker">
                                Your quotes
                            </span>

                            <h2>
                                Health insurance quotes
                            </h2>

                            <p>
                                Create a new quote or manage
                                your existing estimates.
                            </p>

                        </div>

                        <Button
                            className="main-quote-button"
                            onClick={openCreateModal}
                        >
                            Add New Quote
                            <FaArrowRight />
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

                        <Card className="empty-quotes-card">

                            <Card.Body>

                                <FaShieldAlt className="empty-icon" />

                                <h3>
                                    No quotes yet
                                </h3>

                                <p>
                                    Create your first health
                                    insurance estimate.
                                </p>

                                <Button
                                    onClick={openCreateModal}
                                    className="main-quote-button"
                                >
                                    Get your first quote
                                </Button>

                            </Card.Body>

                        </Card>

                    ) : (

                        <Card className="quotes-table-card">

                            <Card.Body className="p-0">

                                <div className="table-responsive">

                                    <Table
                                        hover
                                        className="mb-0 align-middle"
                                    >

                                        <thead>
                                            <tr>
                                                <th>Customer</th>
                                                <th>Cover</th>
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
                                                        <strong>
                                                            {
                                                                quote.customer_name
                                                            }
                                                        </strong>
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
                                                            >
                                                                <FaEye />
                                                            </Button>

                                                            <Button
                                                                variant="outline-secondary"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        quote
                                                                    )
                                                                }
                                                                title="Edit quote"
                                                            >
                                                                <FaPen />
                                                            </Button>

                                                            <Button
                                                                variant="outline-danger"
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        quote
                                                                    )
                                                                }
                                                                title="Delete quote"
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

                </Container>
            </section>

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
        </>
    );
}

export default QuoteListPage;