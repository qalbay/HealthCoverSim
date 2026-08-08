import {
    Alert,
    Badge,
    Card,
    Col,
    ListGroup,
    Row,
} from "react-bootstrap";

function formatCurrency(value) {
    return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
    }).format(Number(value));
}

function ExplanationSheet({ quote, calculation }) {
    const discountAmount =
        calculation.yearlyBeforeDiscount -
        calculation.yearlyAfterDiscount;

    const isYearly =
        quote.payment_frequency === "Yearly";

    const hasWarnings =
        calculation.warnings.length > 0;

    return (
        <div>
            <Card className="shadow-sm mb-4">
                <Card.Header>
                    <h2 className="h5 mb-0">
                        Premium summary
                    </h2>
                </Card.Header>

                <Card.Body>
                    <Row className="g-3">
                        <Col md={4}>
                            <div className="summary-box">
                                <div className="text-muted">
                                    Estimated monthly premium
                                </div>

                                <div className="fs-3 fw-bold">
                                    {formatCurrency(
                                        calculation.monthlyPremium
                                    )}
                                </div>
                            </div>
                        </Col>

                        <Col md={4}>
                            <div className="summary-box">
                                <div className="text-muted">
                                    Yearly before discount
                                </div>

                                <div className="fs-3 fw-bold">
                                    {formatCurrency(
                                        calculation.yearlyBeforeDiscount
                                    )}
                                </div>
                            </div>
                        </Col>

                        <Col md={4}>
                            <div className="summary-box">
                                <div className="text-muted">
                                    Final total
                                </div>

                                <div className="fs-3 fw-bold">
                                    {isYearly
                                        ? formatCurrency(
                                              calculation.yearlyAfterDiscount
                                          )
                                        : formatCurrency(
                                              calculation.monthlyPremium
                                          )}
                                </div>

                                <small className="text-muted">
                                    {isYearly
                                        ? "Final yearly premium"
                                        : "Final monthly premium"}
                                </small>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Row className="g-4">
                <Col lg={7}>
                    <Card className="shadow-sm h-100">
                        <Card.Header>
                            <h2 className="h5 mb-0">
                                Premium breakdown
                            </h2>
                        </Card.Header>

                        <ListGroup variant="flush">
                            <ListGroup.Item className="d-flex justify-content-between">
                                <span>
                                    Hospital premium
                                </span>

                                <strong>
                                    {formatCurrency(
                                        calculation.hospitalPremium
                                    )}
                                </strong>
                            </ListGroup.Item>

                            <ListGroup.Item className="d-flex justify-content-between">
                                <span>
                                    Extras premium
                                </span>

                                <strong>
                                    {formatCurrency(
                                        calculation.extrasPremium
                                    )}
                                </strong>
                            </ListGroup.Item>

                            {quote.cover_type === "Family" && (
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <span>
                                        Family upgrade fee
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            calculation.familyUpgradeFee
                                        )}
                                    </strong>
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item className="d-flex justify-content-between">
                                <span>
                                    Applicant 1 LHC loading
                                </span>

                                <Badge bg="secondary">
                                    {
                                        calculation.applicant1LoadingPercent
                                    }
                                    %
                                </Badge>
                            </ListGroup.Item>

                            {calculation.applicant2LoadingPercent !==
                                null && (
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <span>
                                        Applicant 2 LHC loading
                                    </span>

                                    <Badge bg="secondary">
                                        {
                                            calculation.applicant2LoadingPercent
                                        }
                                        %
                                    </Badge>
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item className="d-flex justify-content-between">
                                <span>
                                    Monthly premium
                                </span>

                                <strong>
                                    {formatCurrency(
                                        calculation.monthlyPremium
                                    )}
                                </strong>
                            </ListGroup.Item>

                            <ListGroup.Item className="d-flex justify-content-between">
                                <span>
                                    Yearly premium before
                                    discount
                                </span>

                                <strong>
                                    {formatCurrency(
                                        calculation.yearlyBeforeDiscount
                                    )}
                                </strong>
                            </ListGroup.Item>

                            {isYearly && (
                                <>
                                    <ListGroup.Item className="d-flex justify-content-between">
                                        <span>
                                            Annual discount (
                                            {
                                                quote.annual_discount
                                            }
                                            %)
                                        </span>

                                        <strong>
                                            −
                                            {formatCurrency(
                                                discountAmount
                                            )}
                                        </strong>
                                    </ListGroup.Item>

                                    <ListGroup.Item className="d-flex justify-content-between">
                                        <span>
                                            Yearly premium after
                                            discount
                                        </span>

                                        <strong>
                                            {formatCurrency(
                                                calculation.yearlyAfterDiscount
                                            )}
                                        </strong>
                                    </ListGroup.Item>
                                </>
                            )}
                        </ListGroup>
                    </Card>
                </Col>

                <Col lg={5}>
                    <Card className="shadow-sm mb-4">
                        <Card.Header>
                            <h2 className="h5 mb-0">
                                Payment explanation
                            </h2>
                        </Card.Header>

                        <Card.Body>
                            {isYearly ? (
                                <p className="mb-0">
                                    The monthly premium and
                                    yearly premium before
                                    discount are shown. The{" "}
                                    {quote.annual_discount}%
                                    annual-payment discount has
                                    been applied to the yearly
                                    total.
                                </p>
                            ) : (
                                <p className="mb-0">
                                    The monthly premium and
                                    yearly premium before
                                    discount are shown. The
                                    annual-payment discount is
                                    not applied because monthly
                                    payment was selected.
                                </p>
                            )}
                        </Card.Body>
                    </Card>

                    <Alert variant="info">
                        {calculation.lhcStatement}
                    </Alert>
                </Col>
            </Row>

            {hasWarnings && (
                <Alert variant="warning" className="mt-4">
                    <Alert.Heading>
                        Quote warnings
                    </Alert.Heading>

                    <ul className="mb-0">
                        {calculation.warnings.map(
                            (warning) => (
                                <li key={warning}>
                                    {warning}
                                </li>
                            )
                        )}
                    </ul>
                </Alert>
            )}

            <Card className="shadow-sm mt-4">
                <Card.Header>
                    <h2 className="h5 mb-0">
                        How this quote was calculated
                    </h2>
                </Card.Header>

                <Card.Body>
                    <p className="mb-0">
                        {calculation.explanation}
                    </p>
                </Card.Body>
            </Card>
        </div>
    );
}

export default ExplanationSheet;