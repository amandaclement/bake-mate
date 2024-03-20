import CircularText from './CircularText.jsx';

export default function Header() {
    return (
        <header>
            {/* Render title along top of a sixteen point asterisk symbol  */}
            <CircularText
                text="BAKEMATE"
                textId="title"
                symbol="&#10042;"
                symbolId="title-symbol"
                radius={45}
                margin={20}
            />
        </header>
    );
}