import { useState, useEffect, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Grid, Avatar, Typography, Paper, InputBase, IconButton, Dialog, Button } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { AttachFile, Call, CallEnd, Favorite, Info, Send, Videocam } from '@material-ui/icons'
import Message from './Message'
import ConversationInfo from './ConversationInfo'
import { db } from '../firebase'
import firebase from 'firebase/app'
import { Fragment } from 'react'
import { useAppSelector } from '../App'

const useStyles = makeStyles((theme: Theme) => createStyles({
    containee: {
        maxHeight: '100vh',
        backgroundColor: theme.palette.type === 'light' ? theme.palette.secondary.light : theme.palette.secondary.dark,
        overflowY: 'hidden',
    },
    headerBar: {
        display: 'flex',
        width: '95%',
        height: '8%',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid',
    },
    mainAvatar: {
        display: 'flex',
        alignItems: 'center'
    },
    avatar: {
        width: 55,
        height: 55,
        marginRight: 8
    },
    statusP: {
        fontSize: theme.typography.subtitle2.fontSize,
        color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark
    },
    func: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '50%',
        alignSelf: 'center'
    },
    funcChild: {
        '&:hover': {
            backgroundColor: theme.palette.info.main,
            borderRadius: 12,
        },
        color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
        border: 'none',
        cursor: 'pointer'
    },
    videoIcon: {
        [theme.breakpoints.down('md')]:{
            fontSize: theme.typography.h6.fontSize,
        },
        [theme.breakpoints.up('md')]:{
            fontSize: theme.typography.h4.fontSize,
        }
    },
    infoIcon: {
        [theme.breakpoints.down('md')]: {
            visibility: 'visible',
            fontSize: theme.typography.h6.fontSize,
        },
        [theme.breakpoints.up('md')]: {
            visibility: 'hidden',
        },
    },
    countMessage: {
        color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
        fontWeight: 800
    },
    messagesField: {
        display: 'flex',
        flexDirection: 'column',
        height: '84%',
        width: '95%',
        overflowY: 'auto',
    },
    typingField: {
        height: '5%',
        width: '95%',
        marginTop: '3%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    input: {
        display: 'none'
    },
    inputText: {
        width: '70%',
        fontSize: theme.typography.fontSize,
        padding: '5%',
    },
    nameAvatar: {
        color: theme.palette.type === 'light' ? '#000' : '#fff'
    },
    callButton: {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.primary.main
    },
    endCallButton: {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.error.main
    },
    videoCallField: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    videoField: {
        display: 'flex',
        justifyContent: 'space-around',
        borderRadius: 12
    },
    funcCall: {
        display: 'flex',
        flexDirection: 'column',
    },
    video: {
        width: '100%',
        height: '100%',
    }
}))

const servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
  }

const MessageContent = () => {
    const classes = useStyles()
    const isLogedIn = useAppSelector(state => state.isLogedIn)
    const yourEmail = isLogedIn.email
    const yourAvatar = isLogedIn.avatarURL
    const { email } = useParams<any>()
    const [open, setOpen] = useState(false)
    const [openAnswer, setOpenAnswer] = useState(false)
    const [messages, setMessages] = useState<Array<any>>([])
    const [avatar, setAvatar] = useState<any>()
    const [friendName, setFriendName] = useState<any>()
    const [inputText, setInputText] = useState('')
    const localVideoSource = useRef<any>(null)
    const remoteVideoSource = useRef<any>(null)
    const history = useHistory()

    useEffect(() => {
        db.collection(yourEmail).doc(`messages with ${email}`).collection(`messages with ${email}`)
        .orderBy('timestamp', 'asc')
        .onSnapshot(async (snap) => {
            setMessages(snap.docs.map(doc => ({
                from: doc.data().fromEmail,
                content: doc.data().content,
                fromAvatar: doc.data().fromAvatar
            })))
            await db.collection(yourEmail).doc(`messages with ${email}`)
            .get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data()
                    if (data) {
                        setAvatar(data.avatarURL)
                        setFriendName(data.name)
                    }
                }
            })
            history.push(`/messages/${email}`)
        })
    }, [email])

    const pc = new RTCPeerConnection(servers)

    const handleClickOpen = async () => {
        setOpen(true)
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        let remote = new MediaStream()
        stream.getTracks().forEach((track:any) => {
            pc.addTrack(track, stream)
        })

        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
              remote.addTrack(track);
            })
        }

        localVideoSource.current.srcObject = stream
        remoteVideoSource.current.srcObject = remote


        const callDoc =  db.collection(yourEmail).doc('calls').collection('calls').doc(`callwith${email}`)
        const offerCandidates = callDoc.collection('offerCandidates')
        const answerCandidates = callDoc.collection('answerCandidates')

        pc.onicecandidate = (e) => {
            e.candidate && offerCandidates.add(e.candidate.toJSON())
        }

        const offerDescription = await pc.createOffer()
        await pc.setLocalDescription(offerDescription)

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type
        }

        await callDoc.set({ offer })

        callDoc.onSnapshot((snapshot) => {
            const data = snapshot.data();
            if (!pc.currentRemoteDescription && data?.answer) {
              const answerDescription = new RTCSessionDescription(data.answer);
              pc.setRemoteDescription(answerDescription)
            }
        })

        answerCandidates.onSnapshot(snap => {
            snap.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const candidate = new RTCIceCandidate(change.doc.data())
                    pc.addIceCandidate(candidate)
                }
            })
        })

    }
    const answerCall = async () => {
        setOpenAnswer(true)
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        let remote = new MediaStream()
        stream.getTracks().forEach((track:any) => {
            pc.addTrack(track, stream)
        })

        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
              remote.addTrack(track);
            })
        }

        localVideoSource.current.srcObject = stream
        remoteVideoSource.current.srcObject = remote

        const callId = `callwith${yourEmail}`
        const callDoc = db.collection(email).doc('calls').collection('calls').doc(callId)
        const answerCandidates = callDoc.collection('answerCandidates')
        const offerCandidates = callDoc.collection('offerCandidates')

        pc.onicecandidate = (e) => {
            e.candidate && answerCandidates.add(e.candidate.toJSON())
        }

        const callData:any =  (await callDoc.get()).data()
        const offerDescription = callData.offer
        await pc.setRemoteDescription(new RTCSessionDescription(offerDescription))
        const answerDescription = await pc.createAnswer()
        await pc.setLocalDescription(answerDescription)

        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        }
        
        await callDoc.update({ answer })

    

        offerCandidates.onSnapshot(snap => {
            snap.docChanges().forEach(change => {
                if (change.type === 'added') {
                    let data = change.doc.data()
                    pc.addIceCandidate(new RTCIceCandidate(data))
                }
            })
        })
    }

    const handleClose = () => {
        setOpen(false)
        setOpenAnswer(false)
        pc.close()
    }


    const sendMessage = async (e:any) => {
        e.preventDefault()
        await db.collection(yourEmail).doc(`messages with ${email}`).collection(`messages with ${email}`).add({
            content: inputText,
            fromEmail: yourEmail,
            fromAvatar: yourAvatar,
            to: email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        await db.collection(yourEmail).doc(`messages with ${email}`).update({
            lastMess: inputText,
            timestamp: `${new Date().getHours()}:${new Date().getMinutes()}`
        })
        await db.collection(email).doc(`messages with ${yourEmail}`).collection(`messages with ${yourEmail}`).add({
            content: inputText,
            fromEmail: yourEmail,
            fromAvatar: yourAvatar,
            to: email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        await db.collection(email).doc(`messages with ${yourEmail}`).update({
            lastMess: inputText,
            timestamp: `${new Date().getHours()}:${new Date().getMinutes()}`
        })
        setInputText('')
    }

    return (
        // <Route path="/messages/:email"> 
        <Fragment>
            <Grid item xs={12} md={6} container alignItems='center' direction='column' className={classes.containee}>
                <div className={classes.headerBar}>
                    <div className={classes.mainAvatar}>
                        <Avatar src={avatar} alt='' className={classes.avatar} />
                        <div>
                            <Typography variant='subtitle1' className={classes.nameAvatar}>{friendName}</Typography>
                            <Typography className={classes.statusP}>Active now</Typography>
                        </div>
                    </div>
                    
                    <div className={classes.func}>
                                <Info className={`${classes.infoIcon} ${classes.funcChild}`} />
                        <div>
                            <IconButton onClick={handleClickOpen}>
                            <Videocam className={`${classes.videoIcon} ${classes.funcChild}`} />
                            </IconButton>
                            <Dialog
                                open={open}
                                onClose={handleClose}
                                className={classes.videoCallField}
                                fullScreen
                            >
                                <div className={classes.videoField}>
                                    <video autoPlay playsInline className={classes.video} ref={localVideoSource} />
                                    <video autoPlay playsInline className={classes.video} ref={remoteVideoSource} />
                                    <Button onClick={handleClose} className={classes.endCallButton} variant='contained' startIcon={<CallEnd />}>
                                        End
                                    </Button>
                                </div>
                            </Dialog>
                        </div>
                        <Typography className={classes.countMessage}>86</Typography>
                        <div className={classes.funcCall}>
                                    <Button className={classes.callButton} onClick={answerCall} variant='contained' color='primary' startIcon={<Call />}>
                                        Answer
                                    </Button>
                                    <Dialog
                                open={openAnswer}
                                onClose={handleClose}
                                className={classes.videoCallField} 
                                fullScreen   
                            >
                                <div className={classes.videoField}>
                                    <video autoPlay playsInline className={classes.video} ref={remoteVideoSource} />
                                    <video autoPlay playsInline className={classes.video} ref={localVideoSource} />
                                </div>
                                 <Button onClick={handleClose} className={classes.endCallButton} variant='contained' startIcon={<CallEnd />}>
                                        End
                                </Button>
                            </Dialog>
                        </div>
                    </div>
                </div>
                <div className={classes.messagesField}>
                   {
                       messages.map(mess => (
                           <Message from={mess.from} avatarSend={mess.fromAvatar} content={mess.content} />
                       ))
                   }
                </div>
                <Paper component='form' onSubmit={sendMessage} className={classes.typingField}>
                    <InputBase value={inputText} onChange={e => setInputText(e.target.value)} placeholder='type something...' className={classes.inputText} />
                    <IconButton>
                        <Favorite color='error' />
                    </IconButton>
                    <input type='file' className={classes.input} id='icon-button-file' />
                    <label htmlFor='icon-button-file'>
                        <IconButton component='span'>
                            <AttachFile />
                        </IconButton>
                    </label>
                    <IconButton disabled={!inputText} type='submit'>
                        <Send color='primary' />
                    </IconButton>
                </Paper>
            </Grid>
            <ConversationInfo name={friendName} avatar={avatar} />
            </Fragment>
        // </Route>
    )
}

export default MessageContent
