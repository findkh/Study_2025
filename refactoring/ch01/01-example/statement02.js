/**
 * 실행 시간: 0.052ms
 *
 * 변경 사항:
 * 1. 금액 계산 로직을 객체로 정리하여 switch 문 제거
 * 2. 포인트 계산 로직을 객체로 정리
 * 3. 공연 정보 처리 및 합산 로직을 간결하게 개선
 * 4. 금액 포맷팅 로직을 별도의 함수로 분리
 * 5. 에러 처리 개선 (유효하지 않은 장르 확인)
 * 6. 변수명 개선 (가독성 향상)
 */
export function statement(invoice, plays) {
  console.time("01-example statement02 최적화 실행 시간");

  try {
    const formatCurrency = (amount) => `$${(amount / 100).toFixed(2)}`;

    // 💡 금액 계산 로직을 객체로 정리 (switch 제거)
    const amountCalculators = {
      tragedy: (audience) =>
        40_000 + (audience > 30 ? 1_000 * (audience - 30) : 0),
      comedy: (audience) =>
        30_000 +
        300 * audience +
        (audience > 20 ? 10_000 + 500 * (audience - 20) : 0),
    };

    // 💡 포인트 계산 로직을 객체로 정리
    const creditCalculators = {
      tragedy: (audience) => Math.max(audience - 30, 0),
      comedy: (audience) =>
        Math.max(audience - 30, 0) + Math.floor(audience / 5),
    };

    // 💡 공연 정보 처리 & 합산
    let totalAmount = 0;
    let totalCredits = 0;
    let result = `청구내역 (고객명: ${invoice.customer})\n`;

    for (const perf of invoice.performances) {
      const play = plays[perf.playID];
      if (!amountCalculators[play.type])
        throw new Error(`알 수 없는 장르: ${play.type}`);

      const amount = amountCalculators[play.type](perf.audience);
      const credits = creditCalculators[play.type](perf.audience);

      result += `${play.name}: ${formatCurrency(amount)} ${perf.audience}석\n`;
      totalAmount += amount;
      totalCredits += credits;
    }

    // 최종 합산 결과 추가
    result += `총액 ${formatCurrency(totalAmount)}\n`;
    result += `적립 포인트 ${totalCredits}점\n`;

    return result;
  } finally {
    console.timeEnd("01-example statement02 최적화 실행 시간");
  }
}
