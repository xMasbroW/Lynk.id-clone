const fs = require('fs');
const content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');
const search = `  const syncLink = React.useMemo(
    () => debounce(async (userId, linkId, updates, previousLinks) => {
      try {
        await linkService.updateLink(linkId, userId, updates);
      } catch (error) {
        setLinksState(previousLinks);
        toast.error("Failed to update link");
        console.error(error);
      }
    }, 1000),
    []
  );`;

const replacement = `  // Debounce per linkId to avoid race conditions and discarded updates
  const syncLinkRef = React.useRef({});
  const syncLink = React.useCallback((userId, linkId, updates, previousLinks) => {
    if (!syncLinkRef.current[linkId]) {
      syncLinkRef.current[linkId] = debounce(async (uId, lId, upds, prevLinks) => {
        try {
          await linkService.updateLink(lId, uId, upds);
        } catch (error) {
          setLinksState(prevLinks);
          toast.error("Failed to update link");
          console.error(error);
        }
      }, 1000);
    }
    syncLinkRef.current[linkId](userId, linkId, updates, previousLinks);
  }, []);`;

if (content.includes(search)) {
  fs.writeFileSync('src/context/AppContext.jsx', content.replace(search, replacement));
  console.log('Fixed debounce');
} else {
  console.log('Search block not found');
}
