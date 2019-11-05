mp.gui.chat.show( false ); //Disables default RageMP Chat
// mp.gui.chat.activate( false );
let chatbox = mp.browsers.new( 'package://custom-chat/chatUI/index.html' );

chatbox.markAsChat();

mp.events.add( 'ToggleChatBoxActive', ( toggle ) => {
    chatbox.execute( `chatAPI.activate( ${ toggle } );` );
} );

mp.events.add( 'ClearChatBox', ( ) => {
    chatbox.execute( 'chatAPI.clear();' );
} );

mp.events.add( 'SetCurrentMenuId', ( menuId ) => {
    chatbox.execute( `chatAPI.activate( ${ menuId === 0 } );` );
} );