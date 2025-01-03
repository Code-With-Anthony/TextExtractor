import { Button, Modal } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'

function ImageCropModal(props) {
    return (
        <Modal
            show={props.imageCropModal}
            onHide={props.hideImageCroppingModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Image Preview
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ textAlign: 'center', padding: 10 }}>
                {
                    props.imageFiles[props.currentImageCroppingIndex]?.crop ?
                        <ReactCrop
                            src={props.imageFiles[props.currentImageCroppingIndex]?.imageUrl}
                            crop={props.crop}
                            ruleOfThirds
                            onImageLoaded={props.onImageLoaded}
                            onComplete={props.onCropComplete}
                            onChange={props.onCropChange}
                            keepSelection={true}
                        />
                        :
                        <img src={props.imageFiles[props.currentImageCroppingIndex]?.imageUrl} alt="selectedImage" style={{ maxHeight: "100%", maxWidth: "100%" }} />
                }
                <div className="text-container">
                    Entry {props.currentImageCroppingIndex + 1} - {props.imageFiles.length} of {props.imageFiles.length}
                </div>
            </Modal.Body>
            <Modal.Footer>
                {
                    props.imageFiles[props.currentImageCroppingIndex]?.crop ?
                        <>
                            <Button onClick={props.handleCancelCrop} style={{ backgroundColor: sessionStorage.getItem('BackgroundColor'), color: 'white' }}>Cancel</Button>
                            <Button onClick={props.handleCropOkayClick} style={{ backgroundColor: sessionStorage.getItem('BackgroundColor'), color: 'white' }}>OK</Button>
                        </>
                        :
                        <>
                            {
                                props.currentImageCroppingIndex >= 1 ?
                                    <Button onClick={props.imageCroppingBackClick} style={{ backgroundColor: sessionStorage.getItem('BackgroundColor'), color: 'white' }}>Back</Button>
                                    : null
                            }
                            <Button onClick={props.imageCropClick} style={{ width: "120px", backgroundColor: sessionStorage.getItem('BackgroundColor'), color: 'white' }}>Crop</Button>
                            <Button onClick={props.onCameraAction} style={{ width: "216px", backgroundColor: sessionStorage.getItem('BackgroundColor'), color: 'white' }}>{props.isRetake ? 'Retake' : 'Camera'}</Button>
                            <Button onClick={props.imageCroppingFurtherClick} style={{ backgroundColor: sessionStorage.getItem('BackgroundColor'), color: 'white' }}>Further</Button>
                        </>
                }
            </Modal.Footer>
        </Modal>
    );
}

export default ImageCropModal;
