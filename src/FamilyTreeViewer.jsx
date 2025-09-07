import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Pencil, Plus, Trash2, Menu, LogOut, X } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

// New imports for separated files
import SidebarMenu from './components/sidebar/SidebarMenu';
import ProfilePanel from './components/panels/ProfilePanel';
import DashboardPanel from './components/panels/DashboardPanel';
import MembersPanel from './components/panels/MembersPanel';
import AddBoardModal from './components/modals/AddBoardModal';

export default function FamilyTreeViewer() {
  // Multi-board support
  const defaultBoard = {
    id: 'b1',
    name: 'Ravi Kumar',
    tree: {
      id: 'p1',
      name: 'Ravi Kumar',
      dob: '1965-02-10',
      spouse: 'Sita Devi',
      notes: 'Founder of the family',
      children: [
        { id: 'p2', name: 'Amit Kumar', dob: '1988-07-05', spouse: 'Neha', notes: 'Elder son', children: [] },
        { id: 'p3', name: 'Sunita Sharma', dob: '1990-09-22', spouse: 'Rohit Sharma', notes: 'Daughter', children: [] }
      ]
    }
  };

  const [boards, setBoards] = useState([defaultBoard]);
  const [activeBoardId, setActiveBoardId] = useState(defaultBoard.id);
  const activeBoard = useMemo(() => boards.find(b => b.id === activeBoardId) || boards, [boards, activeBoardId]);
  const root = activeBoard?.tree;

  // UI state
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', dob: '', spouse: '', notes: '' });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Connectors and zoom
  const svgRef = useRef(null);
  const nodeRefs = useRef({});
  const [lines, setLines] = useState([]);
  const [layoutTick, setLayoutTick] = useState(0);
  const zoomRef = useRef(null);

  // Sidebar view + modals
  const [activeView, setActiveView] = useState(''); // '', 'profile','dashboard','add','members'
  const [profile, setProfile] = useState({ displayName: defaultBoard.name, email: '' });
  const [memberQuery, setMemberQuery] = useState('');

  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [newBoardForm, setNewBoardForm] = useState({ rootName: '', dob: '', spouse: '', notes: '' });

  // Derived for current board
  const flatMembers = useMemo(() => {
    const arr = [];
    function dfs(node, depth = 0) {
      arr.push({ id: node.id, name: node.name, dob: node.dob, depth });
      node.children?.forEach((c) => dfs(c, depth + 1));
    }
    if (root) dfs(root, 0);
    return arr;
  }, [root]);

  const stats = useMemo(() => {
    const count = flatMembers.length;
    const maxDepth = flatMembers.reduce((m, n) => Math.max(m, n.depth), 0);
    return { count, generations: count ? maxDepth + 1 : 0 };
  }, [flatMembers]);

  const boardsList = useMemo(() => boards.map(b => ({ id: b.id, name: b.name })), [boards]);

  // Tree mutations scoped to active board
  const updateTree = useCallback((mutator) => {
    setBoards(prev =>
      prev.map(b => {
        if (b.id !== activeBoardId) return b;
        const newTree = mutator(b.tree);
        return { ...b, tree: newTree };
      })
    );
    setLayoutTick(n => n + 1);
  }, [activeBoardId]);

  function updateMember(updatedPerson) {
    updateTree((tree) => {
      function dfs(node) {
        if (node.id === updatedPerson.id) return { ...updatedPerson, children: node.children || [] };
        return { ...node, children: node.children.map(dfs) };
      }
      return dfs(tree);
    });
  }
  function addChild(parentId, newPerson) {
    updateTree((tree) => {
      function dfs(node) {
        if (node.id === parentId) return { ...node, children: [...node.children, newPerson] };
        return { ...node, children: node.children.map(dfs) };
      }
      return dfs(tree);
    });
  }
  function deleteMember(memberId) {
    updateTree((tree) => {
      if (tree.id === memberId) {
        alert('You cannot delete the root member.');
        return tree;
      }
      function dfs(node) {
        return { ...node, children: node.children.filter((c) => c.id !== memberId).map(dfs) };
      }
      return dfs(tree);
    });
  }

  function getCardColor(level) {
    const colors = [
      'bg-blue-100 border-blue-400',
      'bg-green-100 border-green-400',
      'bg-purple-100 border-purple-400',
      'bg-yellow-100 border-yellow-400',
      'bg-pink-100 border-pink-400'
    ];
    return colors[level % colors.length];
  }

  function PersonCard({ person, level = 0 }) {
    return (
      <div className="flex flex-col items-center">
        <div
          ref={(el) => (nodeRefs.current[person.id] = el)}
          className={`w-60 p-4 pt-8 rounded-xl shadow-lg border text-center relative z-10 ${getCardColor(level)}`}
        >
          <h3 className="font-bold text-lg text-gray-800">{person.name}</h3>
          <p className="text-sm text-gray-600">DOB: {person.dob}</p>
          <p className="text-sm text-gray-600">Spouse: {person.spouse || '—'}</p>
          {person.notes && <p className="mt-2 text-xs text-gray-700 italic">{person.notes}</p>}
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              className="p-1 rounded-full bg-blue-100 hover:bg-blue-200"
              onClick={() => {
                setSelected(person);
                setFormData(person);
                setIsEditing(true);
              }}
            >
              <Pencil className="w-4 h-4 text-blue-600" />
            </button>
            <button
              className="p-1 rounded-full bg-green-100 hover:bg-green-200"
              onClick={() => {
                const newId = 'p' + Date.now();
                addChild(person.id, { id: newId, name: 'New Member', dob: '', spouse: '', notes: '', children: [] });
              }}
            >
              <Plus className="w-4 h-4 text-green-600" />
            </button>
            <button className="p-1 rounded-full bg-red-100 hover:bg-red-200" onClick={() => deleteMember(person.id)}>
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {person.children && person.children.length > 0 && (
          <div className="flex gap-10 justify-center mt-10">
            {person.children.map((child) => (
              <PersonCard key={child.id} person={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const focusMember = (id) => {
    const el = nodeRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    el.classList.add('ring-2', 'ring-blue-500');
    setTimeout(() => el.classList.remove('ring-2', 'ring-blue-500'), 1200);
  };

  // Map DOM point to SVG coords (stable under transforms)
  const toSvgPoint = useCallback((svgEl, clientX, clientY) => {
    const pt = svgEl.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const inv = svgEl.getScreenCTM()?.inverse();
    if (!inv) return { x: clientX, y: clientY };
    const sp = pt.matrixTransform(inv);
    return { x: sp.x, y: sp.y };
  }, []);

  // Recompute connectors
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || !root) return;

    function updateLines() {
      const newLines = [];
      function cardCenter(el) {
        const r = el.getBoundingClientRect();
        const midX = r.left + r.width / 2;
        const topY = r.top;
        const bottomY = r.bottom;
        const start = toSvgPoint(svgEl, midX, bottomY);
        const endTop = toSvgPoint(svgEl, midX, topY);
        return { start, endTop };
      }
      function connect(parent) {
        const parentEl = nodeRefs.current[parent.id];
        if (!parentEl) return;
        const p = cardCenter(parentEl);
        parent.children.forEach((child) => {
          const childEl = nodeRefs.current[child.id];
          if (!childEl) return;
          const c = cardCenter(childEl);
          const midY = (p.start.y + c.endTop.y) / 2;
          newLines.push(`M${p.start.x},${p.start.y} C${p.start.x},${midY} ${c.endTop.x},${midY} ${c.endTop.x},${c.endTop.y}`);
          connect(child);
        });
      }
      connect(root);
      setLines(newLines);
    }

    updateLines();
    const ro = new ResizeObserver(() => updateLines());
    Object.values(nodeRefs.current).forEach((el) => el && ro.observe(el));
    const onResize = () => updateLines();
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [root, sidebarOpen, layoutTick, toSvgPoint, activeBoardId]);

  // Scroll listener for main
  const mainRef = useRef(null);
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setLayoutTick((n) => n + 1);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Zoom
  const zoomOptions = {
    minScale: 0.3,
    maxScale: 8,
    limitToBounds: false,
    centerOnInit: true,
    wheel: { step: 0.1 },
    doubleClick: { disabled: true },
    panning: { velocityDisabled: true },
    onTransformed: () => setLayoutTick((n) => n + 1)
  };
  const handleZoomIn = useCallback(() => zoomRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => zoomRef.current?.zoomOut(), []);
  const handleReset = useCallback(() => {
    const api = zoomRef.current;
    if (!api) return;
    api.resetTransform(0);
    api.centerView(0);
    setLayoutTick((n) => n + 1);
  }, []);

  // New Board submit
  const submitNewBoard = () => {
    const name = (newBoardForm.rootName || '').trim();
    if (!name) {
      alert('Please enter root member name.');
      return;
    }
    const newRootId = 'p' + Date.now();
    const newBoardId = 'b' + Date.now();
    const newBoard = {
      id: newBoardId,
      name,
      tree: {
        id: newRootId,
        name,
        dob: newBoardForm.dob,
        spouse: newBoardForm.spouse,
        notes: newBoardForm.notes,
        children: []
      }
    };
    setBoards(prev => [newBoard, ...prev]);
    setActiveBoardId(newBoardId);
    setSelected(null);
    setIsEditing(false);
    setFormData({ name: '', dob: '', spouse: '', notes: '' });
    setShowAddFamilyModal(false);
    setActiveView('members');
    setNewBoardForm({ rootName: '', dob: '', spouse: '', notes: '' });
    setTimeout(() => handleReset(), 0);
  };

  const closeModal = () => {
    setIsEditing(false);
    setSelected(null);
  };

  return (
    <div className="h-dvh w-dvw bg-slate-100 flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-md px-3 sm:px-4 py-3 flex items-center justify-between z-30 relative">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300">
          <Menu className="w-6 h-6 text-gray-800" />
        </button>
        <h1
  className="
    inline-block
    font-bubble font-extrabold tracking-tight
    text-transparent bg-clip-text
    bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400
    drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]
    text-2xl sm:text-3xl md:text-4xl
  "
>
  Family Tree
</h1>

      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar: only menu + small panels (no Members) */}
        <aside className={`${sidebarOpen ? 'w-56 sm:w-64' : 'w-12 sm:w-16'} bg-white shadow-md transition-all duration-300 flex flex-col shrink-0 z-30`}>
          <SidebarMenu
            sidebarOpen={sidebarOpen}
            onOpenProfile={() => setActiveView('profile')}
            onOpenDashboard={() => setActiveView('dashboard')}
            onOpenAddBoard={() => { setActiveView('add'); setShowAddFamilyModal(true); }}
            onOpenMembers={() => setActiveView('members')}
          />

          <div className="flex-1 overflow-auto p-3 sm:p-4">
            {activeView === 'profile' && (
              <ProfilePanel sidebarOpen={sidebarOpen} profile={profile} setProfile={setProfile} />
            )}
            {activeView === 'dashboard' && (
              <DashboardPanel sidebarOpen={sidebarOpen} stats={stats} />
            )}
            {activeView === '' && sidebarOpen && (
              <div className="text-sm text-gray-500">
                Select an option above to manage profile, view stats, add a new board, or open Members List in the main area.
              </div>
            )}
          </div>

          <div className="p-3 sm:p-4 border-t flex items-center gap-2 cursor-pointer hover:text-red-600 relative z-30">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm sm:text-base">Logout</span>}
          </div>
        </aside>

        {/* Main: shows Members panel when active, else the whiteboard */}
        <main
          ref={mainRef}
          className={`flex-1 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 overflow-y-auto overflow-x-hidden relative ${sidebarOpen ? 'w-[calc(100dvw-14rem)] sm:w-[calc(100dvw-16rem)]' : 'w-[calc(100dvw-3rem)] sm:w-[calc(100dvw-4rem)]'}`}
        >
          {activeView === 'members' ? (
            <MembersPanel
              flatMembers={flatMembers}
              memberQuery={memberQuery}
              setMemberQuery={setMemberQuery}
              addChild={addChild}
              focusMember={focusMember}
              boardsList={boardsList}
              activeBoardId={activeBoardId}
              setActiveBoardId={(id) => {
                setActiveBoardId(id);
                nodeRefs.current = {};
                setTimeout(() => handleReset(), 0);
              }}
              resetBoardView={() => {
                nodeRefs.current = {};
                setTimeout(() => handleReset(), 0);
              }}
            />
          ) : (
            <>
              {/* Zoom toolbar */}
              <div className="absolute right-2 sm:right-3 top-2 sm:top-3 z-50 bg-white/90 backdrop-blur px-1.5 sm:px-2 py-1 rounded shadow flex items-center gap-1.5 sm:gap-2">
                <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm" onClick={handleZoomOut}>-</button>
                <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm" onClick={handleZoomIn}>+</button>
                <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm" onClick={handleReset}>Reset</button>
              </div>

              {/* Whiteboard */}
              <TransformWrapper {...zoomOptions} ref={zoomRef}>
                <TransformComponent wrapperClass="absolute inset-0 z-0" contentClass="relative z-0">
                  <div className="relative" style={{ width: 2400, height: 1600 }}>
                    <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-0">
                      {lines.map((d, i) => (
                        <path key={i} d={d} stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      ))}
                    </svg>

                    <div className="relative w-full h-full flex items-start justify-center pt-20">
                      <div className="flex flex-col items-center gap-20 relative">
                        {root && <PersonCard person={root} />}
                      </div>
                    </div>
                  </div>
                </TransformComponent>
              </TransformWrapper>
            </>
          )}

          {/* Edit Member modal */}
          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
              <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-xl p-4 sm:p-6 relative">
                <button
                  className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">Edit Member</h2>
                <input
                  className="w-full p-2 border rounded mb-2 text-sm sm:text-base"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  className="w-full p-2 border rounded mb-2 text-sm sm:text-base"
                  placeholder="DOB"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
                <input
                  className="w-full p-2 border rounded mb-2 text-sm sm:text-base"
                  placeholder="Spouse"
                  value={formData.spouse}
                  onChange={(e) => setFormData({ ...formData, spouse: e.target.value })}
                />
                <textarea
                  className="w-full p-2 border rounded mb-3 text-sm sm:text-base"
                  placeholder="Notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
                <div className="flex gap-2 sm:gap-3 justify-end">
                  <button className="px-3 sm:px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm sm:text-base" onClick={closeModal}>
                    Cancel
                  </button>
                  <button
                    className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                    onClick={() => {
                      updateMember(formData);
                      closeModal();
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Board (Add Family) modal */}
          <AddBoardModal
            show={showAddFamilyModal}
            onClose={() => setShowAddFamilyModal(false)}
            newBoardForm={newBoardForm}
            setNewBoardForm={setNewBoardForm}
            submitNewBoard={submitNewBoard}
          />
        </main>
      </div>

      <footer className="bg-white shadow-inner px-3 sm:px-4 py-3 text-center text-gray-500 text-xs sm:text-sm z-30 relative">
        © {new Date().getFullYear()} Family Tree Project. All rights reserved.
      </footer>
    </div>
  );
}
