export default function Note({ title, content }) {

    return (
        <div className="note">
            <div className="folder-top">
                <h3 class="folder-top-content">{title}</h3>   
                {/* Used to create folder shape */}
                <div class="folder-top-gap">
                    <div class="folder-top-square" />
                    <div class="folder-top-ellipse" />
                </div>
            </div>

            <div className="folder-bottom">
                {content}        
            </div>
        </div>
    );
}