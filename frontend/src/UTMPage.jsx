// frontend/src/UTMPage.jsx
import React, { useState, useEffect } from "react";
import add_to_db from './services/add_to_db';
import get_user_data from './services/get_user_data';
import ShortenUrlService from './services/short_to_url.js';

// Примеры для подсказок
const UTM_HELP = {
  utm_source: `Источник трафика — откуда пришёл пользователь
Примеры:
yandex → поиск и реклама Яндекса
google → поиск и реклама Google
youtube → трафик с YouTube
vk → трафик из ВКонтакте
telegram → трафик из Telegram
email → email-переходы
offline → офлайн-активности (QR, shortlink)
print → печатные материалы
instagram → трафик из Instagram
facebook → трафик из Facebook`,
  utm_medium: `Тип канала — через что пришёл трафик
Примеры:
cpc → контекстная реклама
cpa → партнёрская / performance
cpm → медийная реклама
social → органический трафик соцсетей
paid_social → платная реклама соцсетей
referral → переходы с внешних сайтов
newsletter → email-рассылки
chatbot → переходы через чат-бот`,
  utm_content: `Идентификатор объявления или варианта
Примеры:
{{ad.id}}, {{banner_id}}, {creative}, {adgroupid}, {ad_id}
banner, button, link, card, form, icon
learn_more, register, sign_up, get_demo, buy_now
v1, v2, v3, qr_code`,
  utm_term: `Ключевое слово или таргетинг
Примеры:
{PHRASE}, id_adv, {keyword}, autotarget, retarget
lookalike, interest, context`,
  utm_campaign: `Название кампании
Формат:
<бренд>_<тип_кампании>_<город/регион>_<направление>_<онлайн/офлайн/гибрид>_<дополнительно>
Пример:
dpo_search_msk_interiordesign_online_v1`
};

// Списки для селектов
const OPTIONS = {
  utm_source: ["yandex","google","vk","telegram","youtube","email","facebook","offline","print","instagram"],
  utm_medium: ["cpc","cpa","cpm","social","paid_social","referral","newsletter","chatbot","posting"],
  utm_content: ["{{ad.id}}","{{banner_id}}","{creative}","{adgroupid}","{ad_id}","banner","button","link","card","form","icon","learn_more","register","sign_up","get_demo","buy_now","v1","v2","v3","qr_code"],
  utm_term: ["{PHRASE}","id_adv","{keyword}","autotarget","retarget","lookalike","interest","context"]
};

// Tooltip компонент
const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            zIndex: 10,
            background: "#333",
            color: "#fff",
            padding: "8px",
            borderRadius: "6px",
            whiteSpace: "pre-wrap",
            width: "300px",
            fontSize: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
          }}
        >
          {text}
        </div>
      )}
    </span>
  );
};

// Мультиселект с автодобавлением из списка и ручным вводом
const MultiSelectInput = ({ options, value, onChange }) => {
  const [inputValue, setInputValue] = useState("");

  // Добавление вручную через кнопку или Enter
  const addValueFromInput = () => {
    if (!inputValue.trim()) return;
    const newValues = [...value];
    inputValue.split(/[\s,]+/).forEach(v => {
      if (v && !newValues.includes(v)) newValues.push(v);
    });
    onChange(newValues);
    setInputValue("");
  };

  // Добавление или удаление по клику на опцию из списка
  const toggleValue = (v) => {
    if (!v) return;
    if (value.includes(v)) {
      onChange(value.filter(x => x !== v));
    } else {
      onChange([...value, v]);
    }
  };

  // Удаление из выбранных
  const removeValue = (v) => onChange(value.filter(x => x !== v));

  return (
    <div style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "4px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "4px" }}>
        {value.map(v => (
          <span key={v} style={{ background: "#eee", padding: "2px 6px", borderRadius: "4px", display: "flex", alignItems: "center" }}>
            {v} <span style={{ cursor: "pointer", marginLeft: "4px" }} onClick={() => removeValue(v)}>×</span>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "4px" }}>
        <input
          list="optionsList"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === "Enter" ? addValueFromInput() : null}
          placeholder="Введите текст или выберите"
          style={{ flex: 1 }}
        />
        <button type="button" onClick={addValueFromInput}>Добавить</button>
        <datalist id="optionsList">
          {options.map(o => <option key={o} value={o} />)}
        </datalist>
      </div>
      <div style={{ marginTop: "4px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {options.map(o => (
          <span
            key={o}
            style={{
              padding: "2px 6px",
              borderRadius: "4px",
              background: value.includes(o) ? "#007bff" : "#eee",
              color: value.includes(o) ? "#fff" : "#000",
              cursor: "pointer",
              fontSize: "12px"
            }}
            onClick={() => toggleValue(o)}
          >
            {o}
          </span>
        ))}
      </div>
    </div>
  );
};

// Главная страница UTM
export default function UTMPage({ user }) {
  const [formData, setFormData] = useState({
    url: "",
    utm_source: [],
    utm_medium: [],
    utm_content: [],
    utm_term: [],
    utm_campaign: ""
  });

  const [generatedURL, setGeneratedURL] = useState("");
  const [shortURL, setShortURL] = useState("");
  const [utmArchive, setUtmArchive] = useState([]);
  const [customShort, setCustomShort] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    get_user_data.get_user_data(user.id)
      .then(res => {
        const archive = res.data.map((item, index) => ({
          id: item.id ?? index + 1,
          url: item.resulting_url || "",
          utm_source: item.source ? item.source.split(",").map(s => s.trim()).filter(Boolean) : [],
          utm_medium: item.medium ? item.medium.split(",").map(s => s.trim()).filter(Boolean) : [],
          utm_content: item.content ? item.content.split(",").map(s => s.trim()).filter(Boolean) : [],
          utm_term: item.term ? item.term.split(",").map(s => s.trim()).filter(Boolean) : [],
          utm_campaign: item.campaign || "",
          generatedURL: item.resulting_url || "",
          date: item.created_at ? new Date(item.created_at).toLocaleString() : ""
        }));
        setUtmArchive(archive);
      })
      .catch(err => {
        console.error("Ошибка загрузки UTM-данных", err);
      });
  }, [user]);

  const clean = s => s.replace(/[\s,]+/g, "_");

  const generateUTM = () => {
    if (!formData.url) return alert("Введите URL страницы");
    if (!user?.id) return alert("Пользователь не авторизован");

    const params = new URLSearchParams({
      utm_source: formData.utm_source.map(clean).join(","),
      utm_medium: formData.utm_medium.map(clean).join(","),
      utm_content: formData.utm_content.map(clean).join(","),
      utm_term: formData.utm_term.map(clean).join(","),
      utm_campaign: clean(formData.utm_campaign)
    }).toString();

    const fullURL = `${formData.url}?${params}&_ym_debug=2`;

    add_to_db.add_to_db({
      user_id: user.id,
      source: formData.utm_source.join(","),
      medium: formData.utm_medium.join(","),
      campaign: formData.utm_campaign,
      term: formData.utm_term.join(","),
      content: formData.utm_content.join(","),
      resulting_url: fullURL,
      created_at: new Date().toISOString()
    })
      .then(res => {
        setUtmArchive(prev => [
          ...prev,
          {
            id: res.data.id || prev.length + 1,
            url: formData.url,
            utm_source: formData.utm_source,
            utm_medium: formData.utm_medium,
            utm_content: formData.utm_content,
            utm_term: formData.utm_term,
            utm_campaign: formData.utm_campaign,
            generatedURL: fullURL,
            date: new Date().toLocaleDateString()
          }
        ]);
      })
      .catch(err => {
        console.error("Ошибка сохранения UTM", err);
        alert("Не получилось сохранить UTM данные");
      });

    setGeneratedURL(fullURL);
  };

  

const shortenLink = async () => {
  let target = customShort || generatedURL;
  if (!target) return alert("Сначала вставьте ссылку или сгенерируйте её!");
  let res = await ShortenUrlService.shortenUrl(target);
  if (res) setShortURL(res);
};

  const copyToClipboard = (val) => navigator.clipboard.writeText(val);

  const removeArchiveRow = (id) => {
    setUtmArchive(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>UTM Generator & Shortener</h1>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Создать UTM</h2>
        <input
          placeholder="URL страницы"
          value={formData.url}
          onChange={e => setFormData({...formData, url: e.target.value})}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />

        {["utm_source","utm_medium","utm_content","utm_term"].map(k => (
          <div key={k} style={{ marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "12px", marginBottom: "2px" }}>
              {k} <Tooltip text={UTM_HELP[k]}><span style={{cursor:"help"}}>❔</span></Tooltip>
            </div>
            <MultiSelectInput
              options={OPTIONS[k]}
              value={formData[k]}
              onChange={vals => setFormData({...formData, [k]: vals})}
            />
          </div>
        ))}

        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ fontSize: "12px", marginBottom: "2px" }}>
            utm_campaign <Tooltip text={UTM_HELP.utm_campaign}><span style={{cursor:"help"}}>❔</span></Tooltip>
          </div>
          <input
            placeholder="utm_campaign"
            value={formData.utm_campaign}
            onChange={e => setFormData({...formData, utm_campaign: e.target.value})}
            style={{ width: "100%" }}
          />
        </div>

        <button onClick={generateUTM}>Сгенерировать UTM</button>
      </div>

      {/* Итоговая ссылка */}
      {generatedURL && (
        <div style={{ marginBottom: "2rem" }}>
          <h3>Итоговая ссылка:</h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input type="text" value={generatedURL} readOnly style={{ flex: 1 }} />
            <button onClick={() => copyToClipboard(generatedURL)}>📎</button>
          </div>
        </div>
      )}

      {/* Сократить любую ссылку */}
      <div style={{ marginBottom: "2rem" }}>
        <h3>Сократить любую ссылку</h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            placeholder="Вставьте любую ссылку"
            value={customShort}
            onChange={e => setCustomShort(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={() => ShortenUrlService.shortenUrl(customShort)}>Сократить</button>
          {shortURL && <button onClick={() => copyToClipboard(shortURL)}>📎</button>}
        </div>
        {shortURL && (
          <div style={{ marginTop: "0.5rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
            <span>Короткая ссылка: {shortURL}</span>
            <button onClick={() => copyToClipboard(shortURL)}>📎</button>
          </div>
        )}
      </div>

      {/* Таблица архива */}
      <div>
        <h2>Архив UTM</h2>
        <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>№</th>
              <th>URL страницы</th>
              <th>utm_source</th>
              <th>utm_medium</th>
              <th>utm_content</th>
              <th>utm_term</th>
              <th>utm_campaign</th>
              <th>Итоговая ссылка</th>
              <th>Дата</th>
              <th>Удалить</th>
            </tr>
          </thead>
          <tbody>
            {utmArchive.map(row => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.url}</td>
                <td>{row.utm_source.join(", ")}</td>
                <td>{row.utm_medium.join(", ")}</td>
                <td>{row.utm_content.join(", ")}</td>
                <td>{row.utm_term.join(", ")}</td>
                <td>{row.utm_campaign}</td>
                <td style={{ display:"flex", gap:"0.5rem" }}>
                  <input type="text" value={row.generatedURL} readOnly style={{ flex: 1 }} />
                  <button onClick={() => copyToClipboard(row.generatedURL)}>📎</button>
                </td>
                <td>{row.date}</td>
                <td>
                  <button onClick={() => removeArchiveRow(row.id)}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
