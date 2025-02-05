export function statement(invoice, plays) {
  // 함수 실행 시간을 측정 시작
  console.time("01-1 statement 실행 시간");

  try {
    let totalAmount = 0; // 총 금액을 저장하는 변수
    let volumeCredits = 0; // 적립된 포인트를 저장하는 변수
    let result = `청구내역 (고객명: ${invoice.customer})\n`; // 청구 내역 문자열 시작

    // 금액 포맷팅을 위한 Intl.NumberFormat 객체 생성
    const format = new Intl.NumberFormat("en-US", {
      style: "currency", // 화폐 형식
      currency: "USD", // 미국 달러화
      maximumFractionDigits: 2, // 소수점 2자리까지 표기
    }).format;

    // invoice.performances 배열을 순회하면서 각 공연에 대해 계산
    for (let perf of invoice.performances) {
      const play = plays[perf.playID]; // 해당 공연의 정보를 plays 객체에서 찾음
      let thisAmount = 0; // 현재 공연에 대한 금액을 저장하는 변수

      // 공연 장르에 따른 금액 계산
      switch (play.type) {
        case "tragedy": // 비극 장르
          thisAmount = 40_000; // 기본 금액 40,000
          if (perf.audience > 30) {
            thisAmount += 1_000 * (perf.audience - 30); // 관객 수가 30명을 초과할 경우 추가 요금
          }
          break;
        case "comedy": // 코미디 장르
          thisAmount = 30_000; // 기본 금액 30,000
          if (perf.audience > 20) {
            thisAmount += 10_000 + 500 * (perf.audience - 20); // 관객 수가 20명을 초과할 경우 추가 요금
          }
          thisAmount += 300 * perf.audience; // 관객 수에 따라 추가 금액
          break;
        default:
          // 알려지지 않은 장르일 경우 오류 발생
          throw new Error(`알 수 없는 장르: ${play.type}`);
      }

      // 💡 포인트 적립 로직
      volumeCredits += Math.max(perf.audience - 30, 0); // 관객 수가 30명 이상인 경우 포인트 적립
      if ("comedy" === play.type) {
        volumeCredits += Math.floor(perf.audience / 5); // 코미디 장르는 5명당 1점 추가 적립
      }

      // 💡 각 공연의 청구 내역을 결과에 추가
      result += `${play.name}: ${format(thisAmount / 100)} ${
        perf.audience
      }석\n`;
      totalAmount += thisAmount; // 총 금액에 현재 공연 금액 더하기
    }

    // 💡 최종 총액과 적립 포인트를 결과에 추가
    result += `총액 ${format(totalAmount / 100)}\n`;
    result += `적립 포인트 ${volumeCredits}점\n`;

    return result; // 최종 청구 내역 문자열 반환
  } finally {
    // 함수 실행 시간 측정 종료
    console.timeEnd("01-1 statement 실행 시간");
  }
}
