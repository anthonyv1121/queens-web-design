import { months, daysCreator } from "../helpers";

export function ArticlesConfig() {

    const $articleDateEl = $(".article__date");
    const datePreText = "Updated";
    const articleDaysDuration = daysCreator(60); // 60 days;

    const updateArticleDate = () => {
        const dateText = $articleDateEl.text().slice(`${datePreText} `.length).replace(",", "")
        const articleDate = new Date(dateText);
        const today = new Date();

        if(today - articleDate > articleDaysDuration) { // is difference between days greater than 60 days?
          const date = today.toLocaleDateString().split("/");
          // console.log({date});
          const [month, day, year] = date;
          $articleDateEl.text(`${datePreText} ${months[month-1]} ${day}, ${year}`)
        }

        $articleDateEl.show();
      }

      return{
        updateArticleDate
      }
}