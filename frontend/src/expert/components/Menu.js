// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * Menu.js
 * 
 * This exports the Menu component of the MIST Expert GUI. On the Menu bar we
 * allow users to save their expert-workspaces, publish the final image, and 
 * save macros that can be used later to make writing their code more easily.
 * 
 * To Do: 
 * 1. Allow users to save their workspaces
 *  Currently, users can (unsafely) save their workspaces, however, nothing is
 *  overwritten.
 * 
 * 2. Allow users to publish their final images
 * 
 * 3. Allow users to delete previous workspaces
 * 
 * 4. Allow users to load previously saved workspaces
 * 
 * For the Future:
 * 1. Allow users to import macros from other workspaces
 * 
 */

import PropTypes from 'prop-types';
import React, { createRef, useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownButton,
    Form,
    FormControl,
    Modal,
    Navbar,
    OverlayTrigger,
    Tooltip,
} from 'react-bootstrap';
import { BsCloud, BsFullscreen, BsFullscreenExit } from 'react-icons/bs';
import { FaRegShareSquare } from 'react-icons/fa';

/**
 * Menu is a React functional component that is the Menu bar to our
 * Expert UI. Its children are two button groups:
 *  1. A File Dropdown, a form-field to name the workspace, and a full-screen button
 *  2. Save & Publish buttons 
 * 
 * We expect it to have the following props, all of which are functions:
 *  getCurrentWorkspace,
    loadWorkspace,
    resetWorkspace,
    requestFullscreen,
    exitFullscreen,
 *
 * We explain these further in the propTypes definition immediately following
 * our functional component.
 * 
 */
function Menu(props) {

    // This will be used to access the name of the workspace for saving the workspace
    const workspaceNameRef = createRef('workspaceName');

    return (
        <Navbar id='menu' bg="dark" variant="dark" style={{ justifyContent: 'space-between', }}>
            <ButtonGroup>
                <FileDropdown
                    getCurrentWorkspace={props.getCurrentWorkspace}
                    loadWorkspace={props.loadWorkspace}
                    resetWorkspace={props.resetWorkspace}
                    workspaceNameRef={workspaceNameRef}
                />
                <Form inline>
                    <FormControl
                        className="mr-sm-2"
                        placeholder="Name your Workspace"
                        ref={workspaceNameRef}
                        type="text"
                    />
                </Form>
                <FullscreenButton
                    requestFullscreen={props.requestFullscreen}
                    exitFullscreen={props.exitFullscreen}
                />
            </ButtonGroup>
            <ButtonGroup>
                <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip>Save your workspace</Tooltip>}
                >
                    <Button
                        onClick={() => props.saveWSToUser(workspaceNameRef.current.value)}
                    > <BsCloud /> Save</Button>
                </OverlayTrigger>
                <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip>Publish your final image</Tooltip>}
                >
                    <Button
                        onClick={() => { console.log('STUB to publish the image') }}
                    ><FaRegShareSquare /> Publish</Button>
                </OverlayTrigger>
            </ButtonGroup>
        </Navbar>
    )
} // Menu(props)

/**
 * 
 * getCurrentWorkspace : A function that returns the current Expert UI workspace, i.e. the 
 *  saved functions and the current form values
 * loadWorkspace : A function that loads one of the user's saved workspaces from the server
 * resetWorkspace : A function resets the workspace to default values
 * requestFullscreen : A function that enables fullscreen 
 * exitFullscreen : A function that disables fullscreen
 */
Menu.propTypes = {
    getCurrentWorkspace: PropTypes.func.isRequired,
    loadWorkspace: PropTypes.func.isRequired,
    resetWorkspace: PropTypes.func.isRequired,
    requestFullscreen: PropTypes.func.isRequired,
    exitFullscreen: PropTypes.func.isRequired,
} // Menu.propTypes

function FullscreenButton(props) {
    const [fullscreen, setFullscreen] = useState(document.fullscreen);
    useEffect(() => {
        const listener = () => setFullscreen(document.fullscreen);
        document.addEventListener('fullscreenchange', listener);
        return () => {
            document.removeEventListener('fullscreenchange', listener);
        }
    }, []);

    if (fullscreen) {
        return (
            <Button onClick={props.exitFullscreen}><BsFullscreenExit /></Button>
        );
    } else {
        return (
            <Button onClick={props.requestFullscreen}><BsFullscreen /></Button>
        );
    }
}

/**
 * The dropdown where we keep our workspace related actions. Here we allow the user to
 * 1. Reset the workspace
 * 2. Delete a workspace
 * 3. Load a workspace
 * 
 * We expect to recieve the following props, which we explain in the propTypes immediately
 * following FileDropdown(props):
 *  getCurrentWorkspace,
    loadWorkspace,
    resetWorkspace,
    workspaceNameRef,
 *
 */
function FileDropdown(props) {
    return (
        <>
            <DropdownButton
                as={ButtonGroup}
                className='menu-btn'
                id="file"
                title="File"
                variant="primary"
            >
                <ResetWorkspace
                    getCurrentWorkspace={props.getCurrentWorkspace}
                    resetWorkspace={props.resetWorkspace}
                />
                <DeleteWorkspace />
                <Dropdown.Divider />

                <ImportWorkspace
                    loadWorkspace={props.loadWorkspace}
                    workspaceNameRef={props.workspaceNameRef} />
                <ExportWorkspace
                    getCurrentWorkspace={props.getCurrentWorkspace}
                    workspaceNameRef={props.workspaceNameRef}
                />
                <ExportWorkspaceAs />
                <Dropdown.Divider />

            </DropdownButton>{' '}
        </>
    )
} // FileDropdown(props)

/**
 * getCurrentWorkspace : A function that returns the current Expert UI workspace, i.e. the 
 *  saved functions and the current form values
 * loadWorkspace : A function that loads one of the user's saved workspaces from the server
 * resetWorkspace : A function resets the workspace to default values
 * workspaceNameRef: An object that points to the workspace-name form inline the Menu bar
 */
FileDropdown.propTypes = {
    getCurrentWorkspace: PropTypes.func.isRequired,
    loadWorkspace: PropTypes.func.isRequired,
    resetWorkspace: PropTypes.func.isRequired,
    workspaceNameRef: PropTypes.object.isRequired,
} // FileDropdown.propTypes

/**
 * This button allows the user to reset the workspace
 */
function ResetWorkspace(props) {
    const [resetWorkspaceModalShow, setResetWorkspaceModalShow] = useState(false);

    const resetModal = (
        <Modal show={resetWorkspaceModalShow} onHide={() => setResetWorkspaceModalShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Reset your workspace</Modal.Title>
            </Modal.Header>
            <Modal.Body> Your workspace is currently in use. Are you sure that you want
            to reset it?
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={() => setResetWorkspaceModalShow(false)}
                    variant="secondary">Close</Button>
                <Button
                    onClick={() => { props.resetWorkspace(); setResetWorkspaceModalShow(false); }}
                    variant="primary">
                    Reset Workspace</Button>
            </Modal.Footer>
        </Modal>
    )

    const isWorkspaceInUse = () => {
        const currentWorkspace = props.getCurrentWorkspace();
        // check if form is in use
        const currentForm = currentWorkspace.form;
        if (currentForm.name || currentForm.params || currentForm.description || currentForm.code)
            return true;
        // check if there are any user defined functions
        const functions = currentWorkspace.functions;
        if (Object.keys(functions).length > 1)
            return true;
        return false;
    }

    return (
        <>
            <Dropdown.Item
                onClick={() => {
                    if (isWorkspaceInUse())
                        setResetWorkspaceModalShow(true)
                }}
            >Reset Workspace</Dropdown.Item>
            {resetModal}
        </>
    );
} // ResetWorkspace(props)

function DeleteWorkspace() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // STUB
    return (
        <>
            <Dropdown.Item onClick={handleShow}>Delete Workspace</Dropdown.Item>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Do you want to delete a workspace?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Not yet implemented</Modal.Body>
            </Modal>
        </>
    );
}

function ImportWorkspace(props) {

    // Done in part by following
    // https://stackoverflow.com/questions/46712554/upload-files-using-react-bootstrap-formcontrol

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const loadFile = (selectedFiles) => {
        if (selectedFiles) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const json = event.target.result;
                let workspaceToLoad;
                try {
                    workspaceToLoad = JSON.parse(json);
                }
                catch (err) {
                    alert("File does not contain a MIST Workspace");
                    return;
                }
                if (workspaceToLoad.fun.class !== "MIST.FunInfo") {
                    alert("File does not contain a MIST Workspace");
                    return;
                }

                props.loadWorkspace(workspaceToLoad);
                props.workspaceNameRef.current.value = workspaceToLoad.name;
            }; // reader.onload
            reader.readAsText(selectedFiles[0]);
        } // if (selectedFiles)
    }

    return (
        <>
            <Dropdown.Item onClick={handleShow}>Load a Workspace</Dropdown.Item>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose a function to load</Modal.Title>
                </Modal.Header>
                <Modal.Body> Select the file to load. Note that MIST Workspace
                     are typically stored in files with a suffix of .ws. </Modal.Body>
                <Form.File id="formcheck-api-regular">
                    <Form.File.Label>Regular file input</Form.File.Label>
                    <Form.File.Input onChange={(event) => { loadFile(event.target.files); handleClose() }} />
                </Form.File>
            </Modal>
        </>
    );
}

function ExportWorkspace(props) {
    const onClickExportWorkspace = () => {
        const currentWorkspace = props.getCurrentWorkspace();

        const currentForm = currentWorkspace.form;

        // Extract the fields
        const about = currentForm.description;
        const code = currentForm.code;
        const name = currentForm.name;
        const params = currentForm.params;
        const fname = (props.workspaceNameRef.current.value ? props.workspaceNameRef.current.value : "untitled") + ".ws";

        // Build an appropriate object
        const fun = new window.MIST.FunInfo(name, null, about, params, { code: code });

        // Retrieve the user defined functions
        const userFuns = currentWorkspace.functions;

        const workspace = {
            name: fname,
            fun: fun,
            userFuns: userFuns,
        }

        // Convert it to JSON
        const json = JSON.stringify(workspace);

        // And save it
        download(fname, "text/json", json);
    }

    return (
        <Dropdown.Item onClick={onClickExportWorkspace}>Export Workspace</Dropdown.Item>
    );
}

function ExportWorkspaceAs() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // STUB
    return (
        <>
            <Dropdown.Item onClick={handleShow}>Export Workspace as...</Dropdown.Item>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Which file type do you want to export this function as?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Not yet implemented</Modal.Body>
            </Modal>
        </>
    );
}

function SaveWorkspace() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // STUB
    return (
        <>
            <Dropdown.Item onClick={handleShow}>Save your Workspace</Dropdown.Item>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Saving your Workspace</Modal.Title>
                </Modal.Header>
                <Modal.Body>Not yet implemented</Modal.Body>
            </Modal>
        </>
    );
}

// +-----------+---------------------
// | Utilities |
// +-----------+

/**
 * Download something.
 *
 * Based on http://html5-demos.appspot.com/static/a.download.html
 */
function download(fname, type, content) {
    // Get our download link
    var link = document.getElementById("mist-downloader");
    if (!link) {
        link = document.createElement("a");
        link.id = "mist-downloader";
        document.body.appendChild(link);
    }

    // Set up where to download
    link.download = fname;

    // Build a blob
    var blob = new Blob([content], { type: type });

    // Build a link to the blob
    link.href = window.URL.createObjectURL(blob);

    // I think this just makes it easier to drag the link to the desktop,
    // but I could be wrong.  (Since we're not showing the link, it's
    // probably irrelevant.  But we might show the link later.)
    link.dataset.downloadurl = [type, link.download, link.href].join(':');

    // Click the link to trigger the save.
    link.click();
} // download

// Menu current never has to rerender
// since we define all of its to be functions whose
// definitions never change
function areEqual(preProps, nextProps) {
    return true;
}

export default React.memo(Menu, areEqual);
