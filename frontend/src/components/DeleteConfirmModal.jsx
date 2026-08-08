import { Button, Modal } from "react-bootstrap";

function DeleteConfirmModal({
    isOpen,
    customerName,
    isDeleting,
    onClose,
    onConfirm,
}) {
    return (
        <Modal
            show={isOpen}
            onHide={onClose}
            centered
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title>Delete Quote</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="mb-0">
                    Are you sure you want to delete the quote for{" "}
                    <strong>{customerName}</strong>?
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="outline-secondary"
                    onClick={onClose}
                    disabled={isDeleting}
                >
                    Cancel
                </Button>

                <Button
                    variant="danger"
                    onClick={onConfirm}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Delete Quote"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteConfirmModal;