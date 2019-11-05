var chat =
{
    size: 0,
    history_limit: 30,  //Change this if you want to hold more/less chat history
    container: null,
    input: null,
    scrolling: false,
    enabled: false,
    active: true,
    submittedMessageHistory: [ ],
    currentSubmittedMessageHistoryIndex: 0,
    maxSavedSubmittedMessages: 30
};

function enableChatInput( enable )
{
    if( chat.active === false && enable === true )
        return;

    if( enable !== ( chat.input != null ) )
    {
        //chat_printing = enable;

        mp.invoke( "focus", enable );

        if( enable )
        {
            chat.scrolling = false;

            chat.input = $( "#chat" ).append( '<div><input id="chat_msg" type="text" /></div>' ).children( ":last" );
            chat.input.children( "input" ).focus( );
            mp.trigger( 'ToggleChat', true );
        }
        else
        {
            chat.input.fadeOut( 'fast', function( )
            {
                chat.input.remove();
                chat.input = null;
            } );

            updateScroll( );
            mp.trigger( 'ToggleChat', false );
        }
    }
}

function updateScroll() {
    var element = document.getElementById("chat_messages" );
    element.scrollTop = element.scrollHeight;
}

function addToSubmittedMessageHistory( message ) {
    chat.submittedMessageHistory.push( message );
    chat.currentSubmittedMessageHistoryIndex = chat.submittedMessageHistory.length;

    if( chat.submittedMessageHistory.length > chat.maxSavedSubmittedMessages )
        chat.submittedMessageHistory.shift( );
}

var chatAPI =
{
    push: ( text ) =>
    {
        chat.container.prepend( "<li>" + text + "</li>" );

        chat.size++;

        if( chat.size >= chat.history_limit )
        {
            chat.container.children( ":last" ).remove( );
        }
    },

    clear: ( ) =>
    {
        chat.container.html( "" );
    },

    activate: ( toggle ) =>
    {
        if( toggle === false && ( chat.input != null ) )
            enableChatInput( false );

        chat.active = toggle;
    },

    show: ( toggle ) =>
    {
        if( toggle )
            $( "#chat" ).show();
        else
            $( "#chat" ).hide();

        chat.active = toggle;
    }
};

$( document ).ready( function( )
{
    chat.container = $( "#chat ul#chat_messages" );

    $( ".ui_element" ).show( );

    chatAPI.push( "Multiplayer started" );

    $( "#chat_messages_container" ).scroll( function( e ) {
        console.log( e.target.scrollHeight );
        chat.scrolling = true;
    } );

    $( "body" ).keydown( function( event )
    {
        // T key
        if( event.which === 84 && chat.input == null && chat.active === true )
        {
            enableChatInput( true );
            event.preventDefault( );
        }
        else if( chat.input != null )
        {
            // Enter key
            if( event.which === 13 ) {

                var value = chat.input.children( "input" ).val( );

                if (value.length > 0)
                {
                    if( value[ 0 ] === "/" )
                    {
                        var cmdText = value.substr( 1 );

                        if( cmdText.length > 0 )
                        {
                            mp.invoke( "command", cmdText.replace( /"/g, '\\"' ) );
                            addToSubmittedMessageHistory( value );
                        }
                    }
                    else
                    {
                        mp.invoke( "chatMessage", value.replace( /"/g, '\\"' ) );
                        // chatAPI.push( value.replace( /"/g, '\\"' ) );
                        addToSubmittedMessageHistory( value );
                    }
                }

                enableChatInput( false );
            }

            // Arrow up key
            if( event.which === 38 ) {
                event.preventDefault( );

                if( chat.currentSubmittedMessageHistoryIndex === 0 )
                    return;

                --chat.currentSubmittedMessageHistoryIndex;
                chat.input.children( "input" ).val( chat.submittedMessageHistory[ chat.currentSubmittedMessageHistoryIndex ] );
            }

            // Arrow down key
            if( event.which === 40 ) {
                event.preventDefault( );

                if( chat.currentSubmittedMessageHistoryIndex === chat.submittedMessageHistory.length )
                    return chat.input.children( "input" ).val( "" );

                ++chat.currentSubmittedMessageHistoryIndex;
                chat.input.children( "input" ).val( chat.submittedMessageHistory[ chat.currentSubmittedMessageHistoryIndex ] );

            }
        }
    } );
} );