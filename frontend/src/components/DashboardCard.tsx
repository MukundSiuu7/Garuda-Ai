import styled from "styled-components";

interface DashboardCardProps {
  title: string;
  description: string;
}

const DashboardCard = ({ title, description }: DashboardCardProps) => {
  return (
    <StyledWrapper>
      <div className="bgblue">
        <div className="card">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .bgblue {
    background: linear-gradient(135deg, #5dd5ff, #214b68, #18354d);
    padding: 1px;
    border-radius: 8px;
    box-shadow: 0 1rem 1.5rem -0.9rem rgba(0, 0, 0, 0.85);
    height: 100%;
  }

  .card {
    height: 100%;
    min-height: 170px;
    font-size: 1rem;
    color: #bec4cf;
    background: linear-gradient(135deg, #071522 0%, #102d45 48%, #071522 100%);
    padding: 2rem;
    border-radius: 7px;
    transition:
      transform 180ms ease,
      box-shadow 180ms ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 24px rgba(56, 189, 248, 0.38);
  }

  h2 {
    color: #f3f6ff;
    margin: 0 0 10px;
    font-size: 1.45rem;
  }

  p {
    margin: 0;
    color: #bec4cf;
    line-height: 1.5;
  }

  @media (max-width: 640px) {
    .card {
      min-height: 145px;
      padding: 1.4rem;
    }

    h2 {
      font-size: 1.25rem;
    }
  }
`;

export default DashboardCard;
