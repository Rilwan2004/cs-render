import { ShieldIcon, ClockIcon, NairaIcon, LockIcon } from "./Icons";

const POINTS = [
    { Icon: ShieldIcon, label: "Verified corpers only" },
    { Icon: ClockIcon, label: "Most listings get a reply within 24 hrs" },
    { Icon: NairaIcon, label: "Free to browse and post" },
    { Icon: LockIcon, label: "Contact details stay private until accepted" },
];

const USPBar = () => (
    <div className="usp-bar">
        <div className="section-inner usp-bar-inner">
            {POINTS.map((point) => (
                <div className="usp-item" key={point.label}>
                    <point.Icon width="16" height="16" />
                    <span>{point.label}</span>
                </div>
            ))}
        </div>
    </div>
);

export default USPBar;
